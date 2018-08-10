import React from "react"
import ReactDOM from 'react-dom'
import Header from "../components/header"
import Footer from "../components/footer"

import UpArrowIcon from "react-icons/lib/fa/arrow-circle-o-up"

import "../styles/layout.scss"

import logo from "../assets/crs_3d.png"

var remark = require('remark'),
    reactRenderer = require('remark-react');

// UTILITIES
const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);
    
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  }
}

if (typeof window !== 'undefined') {
  require('smooth-scroll')('a[href*="#"]');
  window.addEventListener('scroll', debounce(function() {
    document.getElementById('top-link').style.opacity = (pageYOffset-800);
  }, 100));
}

// MAIN COMPONENT
export default ( {data}) => {
  console.log(data);
  const headerInfo = data.allHeaderYaml.edges[0].node;
  const footerInfo = data.allFooterYaml.edges[0].node;
  const sections = data.allSectionsYaml.edges.map(e => e.node);

  const RenderSection = (sectionInfo) => {
    return <div className="manual-section">
      <h1>{sectionInfo.title}</h1>
      <div className="section-content">
        {remark().use(reactRenderer).processSync(sectionInfo.content).contents}
      </div>
    </div>
  }

  return <div className="layout">
    <Header className="site-header">
        <img src={logo} className="logo" />
        <div className="user-manual-info">
            <h1>{headerInfo.title}</h1>
            <h3>{headerInfo.subtitle}</h3>
            <h3>{headerInfo.publicationDate}</h3>
        </div>

    </Header>

    <a id="top-link" href="#">
      <UpArrowIcon/>
      <h2>Top</h2>
    </a>

    {/* Render all sections of the manual from our CMS */}
    {sections.map( sectionInfo => RenderSection(sectionInfo))}

    <Footer className="site-footer">
      <span>&copy; {footerInfo.copyright}</span>
      <span>{footerInfo.address}</span>
    </Footer>

  </div>
}

export const query = graphql`
  query AllData {
  
    allHeaderYaml {
      totalCount
      edges {
        node {
          tagline
          popoutTagline
          popoutTextBlock
          title
          subtitle
          publicationDate
        }
      }
    }

    allFooterYaml {
      totalCount
      edges {
        node {
          copyright
          address
        }
      }
    }

    allSectionsYaml {
      totalCount
      edges {
        node {
          title
          content
        }
      }
    }

  }
`
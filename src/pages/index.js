import React from "react"
import ReactDOM from 'react-dom'
import Header from "../components/header"
import Footer from "../components/footer"
import Sections from "../components/sections"

import UpArrowIcon from "react-icons/lib/fa/arrow-circle-o-up"

import "../styles/layout.scss"
import "../styles/sections.scss"
import "../styles/table.scss"

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

    const RenderSection = (sectionInfo, index) => {
      return <div className="manual-section" id={index}>
      <h1 className="title">{sectionInfo.title}</h1>
      <div className="section-content">
        {remark().use(reactRenderer).processSync(sectionInfo.content).contents}
      </div>
    </div>
    }
    
    const RenderTableOfContents = (sectionInfo, index) => {
      const link = "#" + index;
      return <div className="table-contents">
          <a href={link}>{sectionInfo.title}</a>
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

          {/* Render table of contents */}
          <div className="table-of-contents">
            <h1 className="table-heading">Table of Contents</h1>
            {sections.filter(sectionInfo => sectionInfo.published).sort((sectionInfo1, sectionInfo2) => sectionInfo1.displayOrder > sectionInfo2.displayOrder).map((sectionInfo, index) => RenderTableOfContents(sectionInfo, index))}
          </div>

          {/* Render all sections of the manual from our CMS */}
          <div className="section">
            {sections.filter(sectionInfo => sectionInfo.published).sort((sectionInfo1, sectionInfo2) => sectionInfo1.displayOrder > sectionInfo2.displayOrder).map((sectionInfo, index) => RenderSection(sectionInfo, index))}
          </div>

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
          published
          displayOrder
        }
      }
    }

  }
`
import React from "react";
import ReactDOM from "react-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Markdown from "markdown-to-jsx";

import UpArrowIcon from "react-icons/lib/fa/arrow-circle-o-up";

import "../styles/layout.scss";
import "../styles/sections.scss";
import "../styles/table.scss";

import logo from "../assets/crs_3d.png";

var remark = require("remark"),
  reactRenderer = require("remark-react");

// UTILITIES
const debounce = (fn, time) => {
  let timeout;

  return function() {
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

const formatString = str => {
  return str
    .toLowerCase()
    .split(" ")
    .join("-");
};

function hash(s) {
  return s.split("").reduce(function(a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

function hideOverlay() {
  let overlay = document.querySelector(".lockout-overlay");
  overlay.classList.add("hidden");
  let layout = document.querySelector(".layout");
  layout.classList.remove("blurred");
  layout.classList.remove("hidden");
  window.scrollTo(0, 0);
}

function showOverlay() {
  let overlay = document.querySelector(".lockout-overlay");
  overlay.classList.remove("hidden");
  let layout = document.querySelector(".layout");
  layout.classList.add("blurred");
  layout.classList.remove("hidden");
  window.scrollTo(0, 0);
}

function unlock(e) {
  e.preventDefault();
  var password = document.getElementById("password").value;

  if (hash(password) === 1032675042) {
    hideOverlay();
    document.cookie = "authorized=true";
  } else {
    let errorMsg = document.getElementById("unlock-failed");
    errorMsg.classList.remove("hidden");
    errorMsg.classList.add("shake");
  }

  return false;
}

if (typeof window !== "undefined") {
  require("smooth-scroll")('a[href*="#"]');
  window.addEventListener(
    "scroll",
    debounce(function() {
      document.getElementById("top-link").style.opacity = pageYOffset - 800;
    }, 100)
  );

  function reRenderTableOfContents(toc) {
    var tocDiv = document.querySelector(".table-of-contents");

    var tocItems = [];
    const markup = toc
      .map(item => {
        const c = "toc-item-" + item.type;
        const link = formatString(item.value);
        return `<div class="${c}"><a href="#${link}">${item.value}</a></div>`;
      })
      .join("");

    tocDiv.innerHTML =
      '<h1 className="table-heading">Table of Contents</h1>' + markup;
  }

  var toc = [];
  function load() {
    var sectionHeadings = document.querySelectorAll(".section h1, .section h2");

    var lastSection;
    sectionHeadings.forEach(heading => {
      heading.id = formatString(heading.textContent);
      if (heading.nodeName == "H1") {
        toc[heading.textContent] = [];
        lastSection = heading.textContent;
        toc.push({ type: "section", value: heading.textContent });
      }

      if (heading.nodeName == "H2") {
        toc[lastSection].push(heading.textContent);
        toc.push({ type: "sub-section", value: heading.textContent });
      }
    });

    let unlockFailed = document.querySelector("#unlock-failed");
    unlockFailed.addEventListener("animationend", function(e) {
      this.classList.remove("shake");
    });

    if (document.cookie) hideOverlay();
    else showOverlay();

    reRenderTableOfContents(toc);
  }

  window.onload = load;
}

// MAIN COMPONENT
export default ({ data }) => {
  const headerInfo = data.allHeaderYaml.edges[0].node;
  const footerInfo = data.allFooterYaml.edges[0].node;
  const sections = data.allSectionsYaml.edges.map(e => e.node);

  const RenderSection = (sectionInfo, index) => {
    return (
      <div className="manual-section" id={index}>
        <h1 className="title">{sectionInfo.title}</h1>
        <Markdown>{sectionInfo.content}</Markdown>
      </div>
    );
  };

  const RenderTableOfContents = (sectionInfo, index) => {
    const link = "#" + formatString(sectionInfo.title);
    return (
      <div className="table-contents">
        <a href={link}>{sectionInfo.title}</a>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="layout hidden blurred">
        <Header className="site-header">
          <img src={logo} className="logo" />
          <div className="user-manual-info">
            <h1>{headerInfo.title}</h1>
            <h3>{headerInfo.subtitle}</h3>
            <p>
              <b>{headerInfo.publicationDate}</b>
            </p>
            <p>
              <b>{headerInfo.version}</b>
            </p>
          </div>
        </Header>

        <a id="top-link" href="#">
          <UpArrowIcon />;<h2>Top</h2>
        </a>

        {/* Render table of contents */}
        <div className="table-of-contents">
          <div className="spinner" />
        </div>

        {/* Render all sections of the manual from our CMS */}
        <div className="section">
          {sections
            .filter(sectionInfo => sectionInfo.published)
            .sort((sectionInfo1, sectionInfo2) => {
              return sectionInfo1.displayOrder > sectionInfo2.displayOrder;
            })
            .map((sectionInfo, index) => RenderSection(sectionInfo, index))}
        </div>

        <Footer className="site-footer">
          <span>&copy; {footerInfo.copyright}</span>
          <span>{footerInfo.address}</span>
        </Footer>
      </div>

      <div className="lockout-overlay hidden">
        <div className="lockout-bg" />
        <form onSubmit={unlock}>
          <img src={logo} className="logo" />
          <input id="password" type="password" placeholder="password" />
          <button type="submit">Unlock Documentation</button>
          <p id="unlock-failed" className="hidden">
            Please try again.
          </p>
        </form>
      </div>
    </div>
  );
};

export const query = graphql`
  query AllData {
    allHeaderYaml {
      totalCount
      edges {
        node {
          title
          subtitle
          version
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
`;

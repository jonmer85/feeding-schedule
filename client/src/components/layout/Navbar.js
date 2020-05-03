import React, { Component } from "react";
import { Link } from "react-router-dom";


class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper white">
            <Link
              to="/"
              style={{
                fontFamily: "monospace"
              }}
              className="col s5 brand-logo center black-text"
            > 
              <span>
                <img src="https://storage.cloud.google.com/meran-tech-public/bottle-192x192.png" height="40" width="40" style={{ verticalAlign: "middle", marginRight: "20px" }} />
              </span>
              Feeding Schedule
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}
export default Navbar;
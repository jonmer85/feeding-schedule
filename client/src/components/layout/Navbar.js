import React, { Component } from "react";
import { Link } from "react-router-dom";
import Icon from "@material-ui/core/Icon"


class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav>
          <div className="nav-wrapper teal lighten-3 center">
              <img href="/" src="https://storage.googleapis.com/meran-tech-public/bottle-192x192.png" height="35" width="35" style={{ marginTop: "10px"}}/>
              <Link
              to="/"
              style={{
                fontFamily: "monospace",
                fontSize: "200%",
                verticalAlign: "super"
              }}
            > Feeding Schedule
            </Link>
            <a style={{ float:"right", marginRight: "10px", marginTop: "7px"}} href="mailto:jon@meran.tech?subject=Help%2FBug%2FFeature%20Request">
                <Icon className="align-bottom" >help</Icon>
            </a>
          </div>
        </nav>
      </div>
    );
  }
}
export default Navbar;
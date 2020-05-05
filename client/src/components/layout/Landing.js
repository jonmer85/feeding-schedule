import React, { Component } from "react";
import { Link } from "react-router-dom";
import alexaLogo from "../../assets/alexa.png"

class Landing extends Component {
  render() {
    return (
      <div className="container valign-wrapper">
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              Welcome to the feeding-schedule app!
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Create a user or login to start keeping track of your baby's feeding schedule
            </p>
            <br />
            
            <div className="col s6">
              <Link
                to="/register"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
              >
                Register
              </Link>
            </div>
            <div className="col s6">
              <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large waves-effect waves-light hoverable"
              >
                Log In
              </Link>
            </div>
          </div>
          <img className="col s6 push-s3" src={alexaLogo} />
      
          
        </div>
      </div>
    );
  }
}
export default Landing;
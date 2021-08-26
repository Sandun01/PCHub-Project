import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
class Loader extends Component {
  render() {
    return (
      <div>
        <CircularProgress
          style={{
            width: "100px",
            height: "100px",
            margin: "auto",
            display: "block",
          }}
        ></CircularProgress>
      </div>
    );
  }
}

export default Loader;

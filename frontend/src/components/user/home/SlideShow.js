import React, { Component } from "react";

import { withStyles } from "@material-ui/styles";
import Carousel from "react-material-ui-carousel";

import { autoPlay } from 'react-swipeable-views-utils';
import SwipeableViews from "react-swipeable-views";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = (theme) => ({
  img: {
    height: "100%",
    display: "block",
    overflow: "hidden",
    width: "100%",
  },
});

const images_arr = [
  {
    label: "MSI",
    imgPath: "images/rog.png",
  },
  {
    label: "Asus Rog",
    imgPath: "images/msiWallpaper.png",
  },
  {
    label: "Intel",
    imgPath: "images/intelWallpaper.png",
  },
  {
    label: "AMD",
    imgPath: "images/amdWallpaper.png",
  },
  {
    label: "Fantech",
    imgPath: "images/fantechWallpaper.png",
  },

];
class SlideShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
        activeStep: 0,
    };
  }

  setActiveStep = (step) => {
      this.setState({
          activeStep: step,
      })
  }

  handleStepChange = (step) => {
      this.setState({
          activeStep: step,
      })
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AutoPlaySwipeableViews
        //   axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={this.state.activeStep}
          onChangeIndex={this.handleStepChange}
          enableMouseEvents
        >
          {images_arr.map((step, index) => (
            <div key={step.label}>
              {Math.abs(this.state.activeStep - index) <= 2 ? (
                <img
                  className={classes.img}
                  src={step.imgPath}
                  alt={step.label}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>

        {/* <Carousel
          autoPlay={true}
          indicators={true}
          navButtonsAlwaysVisible={true}
          timeout={400}
        >
          <img src="images/rog.png" width="100%" alt={"Asus rog"} />
          <img
            src="images/msiWallpaper.png"
            width="100%"
            height="100%"
            alt={"MSi"}
          />
          <img
            src="images/amdWallpaper.png"
            width="100%"
            height="100%"
            alt={"Amd"}
          />
          <img
            src="images/intelWallpaper.png"
            width="100%"
            height="100%"
            alt={"Intel"}
          />
          <img
            src="images/fantechWallpaper.png"
            width="100%"
            height="100%"
            alt={"Fantech"}
          />
        </Carousel> */}
      </div>
    );
  }
}

export default withStyles(styles)(SlideShow);

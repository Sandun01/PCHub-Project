import React, { Component } from 'react'
import Carousel from "react-material-ui-carousel";

export default class SlideShow extends Component {
    render() {
        return (
            <div>
                <Carousel
                    autoPlay={true}
                    indicators={true}
                    navButtonsAlwaysVisible={true}
                    timeout={400}
                >
                  <img src="images/rog.png" width="100%"  />
                  <img src="images/msiWallpaper.png" width="100%" height="100%"/>
                  <img src="images/amdWallpaper.png" width="100%" height="100%"/>
                  <img src="images/intelWallpaper.png" width="100%" height="100%"/>
                  <img src="images/fantechWallpaper.png" width="100%" height="100%"/>
                  
                </Carousel>
            </div>
        )
    }
}

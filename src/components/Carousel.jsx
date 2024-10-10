import React from 'react';
import Carousel from 'react-material-ui-carousel';
import salesBanner from '../assets/carousel/salesBanner.png';
import salesBanner1 from '../assets/carousel/salesBanner1.png';
import salesBanner2 from '../assets/carousel/salesBanner2.png';

export default function BannerCarousel() {
  return (
    <>
      <style>
        {`
          .carousel-image {
            width: 100%;
            height: auto;
            max-height: 650px;
            object-fit: cover;
            transition: transform 0.5s ease-in-out;
          }
          .carousel-image:hover {
            transform: scale(1.05);
          }
        `}
      </style>
      <Carousel
        autoPlay={true}
        animation="fade"
        indicators={false}
        navButtonsAlwaysVisible={true}
        cycleNavigation={true}
        swipe={true}
        navButtonsProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            borderRadius: 50,
            margin: 10,
          },
        }}
      >
        <img
          className="carousel-image"
          src={salesBanner}
          alt="Exciting Sales Banner For January"
        />
        <img
          className="carousel-image"
          src={salesBanner1}
          alt="Amazing Discounts in January"
        />
        <img
          className="carousel-image"
          src={salesBanner2}
          alt="New Year Sales Banner"
        />
      </Carousel>
    </>
  );
}

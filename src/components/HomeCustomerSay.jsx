import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div onClick={onClick} className="next-arrow">
      <i className="fa-solid fa-angle-right"></i>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div onClick={onClick} className="prev-arrow">
      <i className="fa-solid fa-angle-left"></i>
    </div>
  );
}

const HomeCustomerSay = () => {
  const reviews = [
    {
      id: 1,
      name: "Mr. Kamal",
      designation: "CEO",
      image: "/img/customer-logo/1.png",
      comments:
        "“ISSL are always accommodating our diverse needs and we feel like they are a part of our Company rather than an external supplier”",
    },
    {
      id: 2,
      name: "Mrs. Rotna",
      designation: "CFO",
      image: "/img/customer-logo/2.png",
      comments:
        "“ISSL are always accommodating our diverse needs and we feel like they are a part of our Company rather than an external supplier”",
    },
    {
      id: 3,
      name: "Mr. Jakir",
      designation: "CTO",
      image: "/img/customer-logo/3.png",
      comments:
        "“ISSL are always accommodating our diverse needs and we feel like they are a part of our Company rather than an external supplier”",
    },
    {
      id: 4,
      name: "Mr. Jamil",
      designation: "CMO",
      image: "/img/customer-logo/4.png",
      comments:
        "“ISSL are always accommodating our diverse needs and we feel like they are a part of our Company rather than an external supplier”",
    },
    {
      id: 5,
      name: "Mr. Mohon",
      designation: "COO",
      image: "/img/customer-logo/5.png",
      comments:
        "“ISSL are always accommodating our diverse needs and we feel like they are a part of our Company rather than an external supplier”",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <Slider {...settings}>
        {reviews.map((review) => (
          <div key={review.id} className="mt-5">
            <div className="border-2 border-gray-300 mx-1 p-3 rounded-md">
              <div>
                <img src={review.image} alt={review.name} />
              </div>
              <div>
                <p className="text-sm py-2">{review.comments}</p>
                <h3 className="font-semibold">{review.name}</h3>
                <p className="text-md">{review.designation}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HomeCustomerSay;

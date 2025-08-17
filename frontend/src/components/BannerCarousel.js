// src/components/BannerCarousel.js
import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./BannerCarousel.css";

const BannerCarousel = ({ category }) => {
  const commonPosters = [
    { src: require("../assets/banners/common1.jpg"), caption: "Shop the Latest Trends" },
    { src: require("../assets/banners/common2.jpg"), caption: "Seasonal Styles Just for You" },
    { src: require("../assets/banners/common3.jpg"), caption: "Upgrade Your Wardrobe Today" },
  ];

  const categoryPosters = {
    Men: [
      { src: require("../assets/banners/men1.jpg"), caption: "Men's T-Shirts & More" },
      { src: require("../assets/banners/men2.jpg"), caption: "Style that Speaks for Him" },
      { src: require("../assets/banners/men3.jpg"), caption: "Bold, Modern, Iconic" },
    ],
    Women: [
      { src: require("../assets/banners/women1.jpg"), caption: "Grace in Every Drape" },
      { src: require("../assets/banners/women2.jpg"), caption: "Elegant Ethnic Styles" },
      { src: require("../assets/banners/women3.jpg"), caption: "Be Bold. Be Beautiful." },
    ],
    Kids: [
      { src: require("../assets/banners/kids1.jpg"), caption: "Adorable Outfits for Little Stars" },
      { src: require("../assets/banners/kids2.jpg"), caption: "Trendy & Comfy for Kids" },
      { src: require("../assets/banners/kids3.jpg"), caption: "Style Meets Playtime" },
    ],
  };

  const posters = category && categoryPosters[category] ? categoryPosters[category] : commonPosters;

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    setIndex(0);
  }, [category]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [index, posters.length]);

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % posters.length);
      setFade(true);
    }, 300);
  };

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prevIndex) => (prevIndex - 1 + posters.length) % posters.length);
      setFade(true);
    }, 300);
  };

  return (
    <div className="carousel-wrapper">
      <div className="banner-carousel">
        <button className="nav-button left" onClick={prevSlide}>
          <FaChevronLeft />
        </button>

        <img
          src={posters[index].src}
          alt="Poster"
          className={`banner-image ${fade ? "fade-zoom-slide" : "fade-out"}`}
        />

        <div className={`banner-caption ${fade ? "caption-show" : "caption-hide"}`}>
          {posters[index].caption}
        </div>

        <button className="nav-button right" onClick={nextSlide}>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default BannerCarousel;

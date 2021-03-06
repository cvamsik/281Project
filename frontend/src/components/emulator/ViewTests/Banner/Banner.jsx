import React from "react";
import BannerCard from "../BannerCard/BannerCard";
import "./Banner-styles.css";

const Banner = ({ bannerDetails }) => {
  return (
    <div className="Banner">
      {bannerDetails.map((details) => (
        <BannerCard props={details} />
      ))}
    </div>
  );
};

export default Banner;

import Image from "next/image";
import React from "react";

export const StarRating = ({ rating }) => {
  const stars = new Array(rating).fill(0);
  return (
    <>
      {stars.map((star, index) => (
        <Image
          alt="Rating"
          key={index}
          src={`/assets/star.svg`}
          width={20}
          height={20}
        />
      ))}
    </>
  );
};

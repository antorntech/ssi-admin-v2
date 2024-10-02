import React from "react";

const Points = () => {
  const points = [];
  return (
    <>
      <h1 className="text-xl font-bold">Points</h1>
      <p className="text-sm text-gray-500">
        points are {points.length > 0 ? "" : "not"} available here.
      </p>
    </>
  );
};

export default Points;

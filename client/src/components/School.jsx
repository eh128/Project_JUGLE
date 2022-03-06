import React, { useState, useEffect } from "react";

const School = ({ school }) => {
  //declare image state
  const [imagePath, setImagePath] = useState("");

  //get image from the server
  const getImage = () => {
    fetch(`/images/${school.id}`)
      .then((response) => response.blob())
      .then((blob) => {
        setImagePath(URL.createObjectURL(blob));
      });
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <div className="school-container">
      <img
        className="images"
        src={imagePath}
        alt={`Image of ${school.school_name}`}
      />
      <div className="description-container">
        <h2>{school.school_name}</h2>
        <p>{school.about}</p>
      </div>
    </div>
  );
};

export default School;

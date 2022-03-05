import React, { useState, useEffect } from "react";

const School = ({ school }) => {
  const [imagePath, setImagePath] = useState("");

  const getImage = () => {
    fetch(`/images/${school.id}`)
      .then((response) => response.blob())
      .then((blob) => {
        setImagePath(URL.createObjectURL(blob));
      });
  };

  useEffect(() => {
    // getSchool();
    getImage();
  }, []);

  return (
    <div>
      <div>{school.school_name}</div>
      <div>{school.about}</div>
      <img src={imagePath} alt={`Image of ${school.school_name}`} />
    </div>
  );
};

export default School;

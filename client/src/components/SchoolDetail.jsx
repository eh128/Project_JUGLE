import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const SchoolDetail = () => {
  const { id } = useParams();

  const [school, setSchool] = useState({});
  const [imagePath, setImagePath] = useState("");

  //get school with specified id
  const getSchool = () => {
    fetch(`/schools/${id}`)
      .then((response) => response.json())
      .then((data) => setSchool(data));
  };
  const getImage = () => {
    fetch(`/images/${id}`)
      .then((response) => response.blob())
      .then((blob) => {
        setImagePath(URL.createObjectURL(blob));
      });
  };

  useEffect(() => {
    getSchool();
    getImage();
  }, []);

  return (
    <div className="details-container">
      <div className="column column-left">
        <img src={imagePath} alt={`Image of ${school.school_name}`} />
        <Link
          className="update-btn link"
          to={{ pathname: `/schools/${school.id}/update`, state: { school } }}
        >
          Update
        </Link>
      </div>
      <div className="column column-right">
        <h2>{school.school_name}</h2>
        <p>{school.about}</p>
      </div>
    </div>
  );
};

export default SchoolDetail;

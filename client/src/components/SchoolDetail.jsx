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
    <div>
      <div>{school.school_name}</div>
      <div>{school.about}</div>
      <img src={imagePath} alt="" />
      <Link
        to={{
          pathname: `/schools/${school.id}/update`,
          state: {
            school,
          },
        }}
      >
        Update
      </Link>
    </div>
  );
};

export default SchoolDetail;

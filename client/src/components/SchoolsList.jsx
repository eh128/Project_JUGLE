import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

//import detail page component
// import DetailPage from "../routes/DetailPage";
import School from "./School";

const SchoolsList = () => {
  const [schools, setSchools] = useState([]);

  //get array of all schools
  const getSchools = () => {
    fetch("/schools")
      .then((response) => response.json())
      .then((data) => setSchools(data));
  };

  useEffect(() => {
    getSchools();
  }, []);

  return (
    <div>
      {schools.map((school) => (
        <div key={school.id}>
          <Link to={`/schools/${school.id}`}>
            <School school={school}></School>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SchoolsList;

import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const CreateForm = ({ school }) => {
  //if school is defined, the form is used for updating
  //else the form is for creating a new school
  let tempName;
  let tempAbout;
  if (school) {
    tempName = school.school_name;
    tempAbout = school.about;
  } else {
    tempName = "";
    tempAbout = "";
  }

  // define states
  const [name, setName] = useState(tempName);
  const [about, setAbout] = useState(tempAbout);
  const [image, setImage] = useState(undefined);

  const history = useHistory();
  const { id } = useParams();

  // make post request if the form is for creating a new school
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const school = { school_name: name, about };
      const formData = new FormData();
      formData.append("image", image);
      fetch("/schools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(school),
      });
      //add image
      fetch("/images", {
        method: "POST",
        body: formData,
      }).then(() => {
        //return to Home page
        history.push("/");
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  // make put request if the form is used for updating an existing school
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const school = { school_name: name, about };
      const formData = new FormData();
      formData.append("image", image);
      fetch(`/schools/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(school),
      });
      //delete the image from S3 and replace it with the new image file
      fetch(`/images/${id}`, { method: "DELETE" });
      fetch(`/images/${id}`, { method: "POST", body: formData }).then(() => {
        //return to Home page
        history.push("/");
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>Create a listing</h1>
      <form className="form" onSubmit={school ? handleUpdate : handleSubmit}>
        <div className="row">
          <label>Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="row">
          <label>About</label>
          <textarea
            cols="20"
            rows="5"
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="row">
          <label>Image</label>
          <input
            id="file"
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button>{school ? "Update" : "Submit"}</button>
      </form>
    </div>
  );
};

export default CreateForm;

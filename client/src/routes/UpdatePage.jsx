import React from "react";
import { useLocation } from "react-router-dom";

//import components
import Form from "../components/Form";

const UpdatePage = () => {
  const location = useLocation();
  const { school } = location.state;
  return (
    <div>
      <div>Update</div>
      <Form school={school} />
    </div>
  );
};

export default UpdatePage;

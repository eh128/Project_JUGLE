import React from "react";
import { useLocation } from "react-router-dom";

//import components
import Form from "../components/Form";
import Header from "../components/Header";

const UpdatePage = () => {
  const location = useLocation();
  const { school } = location.state;
  return (
    <div>
      <Header />
      <Form school={school} />
    </div>
  );
};

export default UpdatePage;

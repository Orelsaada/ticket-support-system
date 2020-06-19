import React, { useState, useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";

function NewIncident() {
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);

  // If user isn't login redirect to login
  if (!isAuthenticated) return <Redirect to="/" />;

  return (
    <section className="new-incident">
      <h1>Create new incident</h1>
    </section>
  );
}

export default NewIncident;

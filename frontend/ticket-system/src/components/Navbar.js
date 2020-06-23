import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "./componentsStyles/Navbar.css";

const CustomNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  const [userName, setUserName] = useState("");

  // On change of authentication state - get username.
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/api/auth/user",
      data: localStorage.getItem("user-id"),
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    })
      .then((res) => setUserName(res.data.name))
      .catch((err) => console.log(err));
  }, [isAuthenticated]);

  // Logout functionality
  const logout = () => {
    setIsAuthenticated(false);
    setUserName("");
    localStorage.removeItem("token");
    localStorage.removeItem("user-id");
  };

  return (
    <nav>
      <ul>
        <li>
          <div className="brand-link">
            <NavLink to="/">
              <h4>Service Manager</h4>
            </NavLink>
          </div>
        </li>

        {/* Links for authenticated users (New, username, logout) */}
        {isAuthenticated && (
          <li>
            <NavLink to="/my-incidents/new">New Ticket</NavLink>
          </li>
        )}

        {userName && (
          <div className="username">
            <h6>{userName}</h6>
          </div>
        )}

        {isAuthenticated && (
          <div className="logout">
            <li>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default CustomNavbar;

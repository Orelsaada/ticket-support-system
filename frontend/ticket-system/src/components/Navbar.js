import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { UserContext } from "./UserContext";
import "./componentsStyles/Navbar.css";

const CustomNavbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  const [user, setUser] = useContext(UserContext);
  const [userName, setUserName] = useState("");

  const token = localStorage.getItem("token");

  // On change of authentication state - get username.
  useEffect(() => {
    axios({
      method: "get",
      url: "/api/auth/user",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    })
      .then((res) => {
        setUser(res.data);
        setUserName(res.data.name);
        setIsAuthenticated(true);
      })
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
            <NavLink to="/my-incidents">
              <h4>Service Manager</h4>
            </NavLink>
          </div>
        </li>

        {/* New ticket will be shown only to authenticated user role. */}
        {isAuthenticated && user.role == "User" && (
          <li>
            <NavLink to="/my-incidents/new">New Ticket</NavLink>
          </li>
        )}

        {/* Permissons will be shown only to admin role. */}
        {isAuthenticated && user.role == "Admin" && (
          <li>
            <NavLink to="/permissons">Permissons</NavLink>
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

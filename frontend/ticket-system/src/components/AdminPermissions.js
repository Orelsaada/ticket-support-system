import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Redirect } from "react-router-dom";

const AdminPermissions = () => {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // Request once to get username base on user id.
  // If the user isn't admin redirect to login.
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/api/auth/user",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => {
        if (res.data.role != "Admin") return <Redirect to="/" />;
        setUserName(res.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Get all users without the user that currently login.
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/api/permissions/users",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => {
        setUsers(res.data.filter((user) => user.name != userName));
      })
      .catch((e) => console.log(e));
  }, [userName]);

  // If user isn't login redirect to login
  if (!isAuthenticated) return <Redirect to="/" />;

  return (
    <section className="permissions">
      <div className="container">
        <h1>Permissions View</h1>
        <form>
          <div className="form-group">
            <label htmlFor="user">User</label>
            <select className="form-control" id="user">
              {users.map((user, index) => {
                return <option key={index}>{user.name}</option>;
              })}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select className="form-control" id="role">
              <option>Add dynamic roles here</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminPermissions;

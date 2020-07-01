import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Redirect } from "react-router-dom";
import "./componentsStyles/AdminPermissions.css";

const AdminPermissions = () => {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [result, setResult] = useState();
  const [myInputs, setMyInputs] = useState({ user: null, role: "Admin" });
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // Request once to get username base on user id.
  // If the user isn't admin redirect to login.
  useEffect(() => {
    axios({
      method: "get",
      url: "/api/auth/user",
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
      url: "/api/permissions/users",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => {
        setUsers(res.data.filter((user) => user.name != userName));
      })
      .catch((e) => console.log(e));
  }, [userName]);

  // If user isn't login redirect to login
  if (!isAuthenticated) return <Redirect to="/" />;

  // Handle the form changes
  const handleChange = (e) => {
    setMyInputs({
      ...myInputs,
      [e.target.name]: e.target.value,
    });
  };

  // Find user and his role.
  const findUser = (e) => {
    e.preventDefault();

    axios({
      method: "get",
      url: `/api/permissions/user?name=${myInputs.searchUser}`,
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((user) => {
        if (!user.data) alert("Could not find that user.");
        setResult(user.data);
      })
      .catch((e) => console.log(e));
  };

  // Changing the user role
  const handleSubmit = (e) => {
    e.preventDefault();

    // if user field didn't changed - set input as first username.
    if (!myInputs.user) myInputs.user = users[0].name;

    const { user, role } = myInputs;
    axios({
      method: "post",
      url: "/api/permissions/update",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      data: { user, role },
    })
      .then((res) => alert(res.data.msg))
      .catch((e) => console.log(e));
  };

  return (
    <section className="permissions">
      <div className="container">
        <h1>View Permissions</h1>

        <div className="search-user-div">
          <form onSubmit={findUser}>
            <div className="form-group">
              <label htmlFor="searchUser">Search User (case-sensitive)</label>
              <input
                type="text"
                id="searchUser"
                name="searchUser"
                className="form-control"
                onChange={handleChange}
              ></input>
            </div>
            <input
              type="submit"
              value="Search"
              className="btn btn-primary"
            ></input>
          </form>

          <br />

          {/* Results table will be shown upon results. */}
          {result && (
            <table className="table results">
              <thead>
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{result.name}</td>
                  <td>{result.email}</td>
                  <td>{result.role}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <hr />

        <div className="change-permission-div">
          <h1>Change Permissions</h1>
          <form onSubmit={handleSubmit} className="change-form">
            <div className="form-group">
              <label htmlFor="user">User</label>
              <select
                className="form-control"
                id="user"
                name="user"
                onChange={handleChange}
              >
                {users.map((user, index) => {
                  return <option key={index}>{user.name}</option>;
                })}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                className="form-control"
                id="role"
                name="role"
                onChange={handleChange}
              >
                <option>Admin</option>
                <option>User</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminPermissions;

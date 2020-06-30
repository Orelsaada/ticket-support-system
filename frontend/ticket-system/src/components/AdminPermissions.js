import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Redirect } from "react-router-dom";

const AdminPermissions = () => {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [msg, setMsg] = useState("");
  const [myInputs, setMyInputs] = useState({ role: "Admin" });
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
        setMyInputs({ user: users[0].name });
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

  // Changing the user role
  const handleSubmit = (e) => {
    e.preventDefault();

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
        <h1>Permissions View</h1>
        <form onSubmit={handleSubmit}>
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
    </section>
  );
};

export default AdminPermissions;

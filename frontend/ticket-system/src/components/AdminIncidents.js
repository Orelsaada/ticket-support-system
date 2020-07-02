import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import "./componentsStyles/AdminIncidents.css";
import { AuthContext } from "./AuthContext";
import { get } from "mongoose";

function AdminIncidents() {
  const [filters, setFilters] = useState({ status: "Open", user: "" });
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [allIncidents, setAllIncidents] = useState([]);
  const [error, setError] = useState([]);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
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
        setError(...error, err.data);
      });
  }, []);

  // Get All incidents function
  const getIncidentsAndFilter = () => {
    axios({
      method: "get",
      url: "/api/incidents/admin",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => {
        setAllIncidents(res.data.reverse());
      })
      .catch((err) => setError(...error, err.data));
  };

  // First time get all incidents and first filter by Open.
  useEffect(() => {
    axios({
      method: "get",
      url: "/api/incidents/admin",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => {
        setAllIncidents(res.data.reverse());
        setIncidents(res.data.filter((inc) => inc.status === "Open"));
      })
      .catch((err) => setError(...error, err.data));
  }, []);

  // Get all incidents on every status change.
  useEffect(() => {}, [filters.status]);

  // Filter incidents based on active filters.
  useEffect(() => {
    getIncidentsAndFilter();
    setIncidents(
      allIncidents.filter(
        (inc) => inc.status === filters.status && inc.userName == filters.user
      )
    );
    if (!filters.user)
      setIncidents(allIncidents.filter((inc) => inc.status === filters.status));
  }, [filters]);

  // If user isn't login redirect to login
  if (!isAuthenticated) return <Redirect to="/" />;

  const filterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <section className="user-incidents">
      <div className="container">
        <h1>Dashboard</h1>
        {error &&
          error.map((err) => {
            return <h1>{err.data}</h1>;
          })}

        <h1>Hello {userName}</h1>

        <div className="table-div">
          <div className="filters ">
            <h6>Filtered by:</h6>
            <form>
              <div className="form-group form-row align-items-end">
                <div className="col-sm-2">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    className="form-control"
                    onChange={filterChange}
                  >
                    <option>Open</option>
                    <option>Closed</option>
                  </select>
                </div>
                <div className="col-sm-2">
                  <label htmlFor="user">User (case-sensitive))</label>
                  <input
                    type="text"
                    id="user"
                    name="user"
                    className="form-control"
                    placeholder="All"
                    onChange={filterChange}
                  ></input>
                </div>
              </div>
            </form>
          </div>

          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">SD</th>
                <th scope="col">User</th>
                <th scope="col">Title</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident, index) => {
                return (
                  <tr key={index}>
                    <td>SD{incident.sd}</td>
                    <td>{incident.userName}</td>
                    <td>{incident.title}</td>
                    <td>{dateFormat(incident)}</td>
                    <td>
                      <span
                        className={`badge ${
                          incident.status == "Open"
                            ? "badge-success"
                            : "badge-danger"
                        }`}
                      >
                        {" "}
                        {incident.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const dateFormat = (incident) => {
  const date = `${incident.createdAt.split("/")[1]}/${
    incident.createdAt.split("/")[0]
  }/${incident.createdAt.split("/")[2]}
  `;

  return date;
};

export default AdminIncidents;

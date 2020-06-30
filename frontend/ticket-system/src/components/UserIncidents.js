import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router";
import "./componentsStyles/UserIncidents.css";
import { AuthContext } from "./AuthContext";
import { UserContext } from "./UserContext";
import CloseModal from "./Modal";

function UserIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [incidentId, setIncidentId] = useState("");
  const [error, setError] = useState([]);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  const [user, setUser] = useContext(UserContext);
  const userId = localStorage.getItem("user-id");
  const token = localStorage.getItem("token");
  const history = useHistory();

  // Request once to get username base on user id.
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:56524/api/auth/user",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => {
        console.log("first useeffect " + res.data);
        setUserName(res.data.name);
        if (res.data.role == "Admin") history.push("/admin-incidents");
      })
      .catch((err) => console.log(err));
  }, []);

  // Request to get the incidents.
  useEffect(() => {
    axios({
      method: "get",
      url: "/api/incidents",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
    })
      .then((res) => {
        console.log("second useeffect " + res.data);
        setIncidents(res.data.reverse());
      })
      .catch((err) => setError(...error, err.data));
  }, [incidents]);

  // If user isn't login redirect to login
  if (!isAuthenticated) return <Redirect to="/" />;

  // Remove Incident(Not Used)
  const removeIncident = (id) => {
    axios({
      method: "delete",
      url: "/api/incidents/delete",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      data: { id },
    })
      .then((res) => {
        alert(res.data.msg);
        setIncidents(incidents.filter((incident) => incident._id != id));
      })
      .catch((err) => console.log(err));
  };

  // Close the modal of closing incident.
  const closeModal = () => {
    setShowModal(false);
  };

  // Close incident on modal.
  const acceptModal = (id) => {
    setShowModal(false);
    axios({
      method: "post",
      url: "/api/incidents/close",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      data: { id },
    })
      .then((res) => {
        alert(res.data.msg);
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className="user-incidents">
      <div className="container">
        <h1>{error}</h1>
        <h1>Hello {userName}</h1>
        <h2> Your incidents </h2>
        {incidents.map((incident, index) => (
          <div key={index} className="incident">
            <div className="left-side-incident">
              <h6>SD102546(TO-CHANGE)</h6>
              <h6
                className={`badge ${
                  incident.status == "Open" ? "badge-success" : "badge-danger"
                }`}
              >
                {incident.status}
              </h6>
              <h6>{`${incident.createdAt.split("/")[1]}/${
                incident.createdAt.split("/")[0]
              }/${incident.createdAt.split("/")[2]}
              `}</h6>
            </div>

            <div className="middle-incident">
              <h5>
                <strong> {incident.title}</strong>
              </h5>
              <p>{incident.description}</p>
            </div>

            {/* Show "Close" button only if the incident isn't closed. */}
            {incident.status != "Closed" ? (
              <div className="right-side-incident">
                <div className="close-incident">
                  <button
                    className="close-btn"
                    onClick={() => {
                      setShowModal(true);
                      setIncidentId(incident._id);
                    }}
                  >
                    <i className="fa fa-check-square-o" aria-hidden="true"></i>
                    Close
                  </button>
                </div>

                <CloseModal
                  open={showModal}
                  closeModal={closeModal}
                  acceptModal={() => {
                    acceptModal(incidentId);
                  }}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default UserIncidents;

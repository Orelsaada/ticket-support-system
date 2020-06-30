import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { UserContext } from "./UserContext";
import "./componentsStyles/LoginPage.css";

const LoginPage = () => {
  const [myInputs, setMyInputs] = useState({});
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useContext(AuthContext);
  const [user, setUser] = useContext(UserContext);
  const history = useHistory();

  // const devUrl = `http://localhost:${process.env.PORT || 5000}`;

  // If token in localstorage, validate token and connect.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios({
        method: "post",
        url: `/api/auth/isValidToken`,
        data: { token },
      })
        .then((res) => {
          if (res.data == false) {
            localStorage.removeItem("token");
          } else {
            setIsAuthenticated(true);
            history.push("/my-incidents");
          }
        })
        .catch((e) => console.log(e));
    }
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    setMyInputs({
      ...myInputs,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { email: myInputs.email, password: myInputs.password };
    setError("");

    axios({
      method: "post",
      url: `/api/auth`,
      data: user,
    })
      .then((res) => {
        // res.data contain user object and token string.
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user-id", res.data.user.id);
          setIsAuthenticated(true);
          setUser(res.data.user);

          if (res.data.user.role === "User") {
            history.push("/my-incidents");
          } else if (res.data.user.role == "Admin") {
            history.push("/admin-incidents");
          }
        }
      })
      .catch((err) => setError(err.response.data.msg));
  };

  return (
    <section className="login-section">
      <div className="main-div">
        <p>Testing user: "test@test.com / admin@admin.com", password: 123456</p>
        {error && <p>{error}</p>}
        <div className="card-container">
          <h2 className="mt-4 mb-4 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                onChange={handleChange}
              ></input>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={handleChange}
              ></input>
            </div>
            <button type="submit" className="btn btn-dark">
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;

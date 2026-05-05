import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

var BACKEND = "https://project-management-system-1-31jx.onrender.com/api";

function Login() {
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [error, setError] = useState("");

  var navigate = useNavigate();

  function handleLogin() {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    fetch(BACKEND + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userName", data.name);
          navigate("/dashboard");
        } else {
          setError(data.message);
        }
      })
      .catch(function () {
        setError("Something went wrong. Try again.");
      });
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h4>Login</h4>
        <p className="sub">Project Management System</p>

        <input
          className="form-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={function (e) {
            setEmail(e.target.value);
          }}
        />

        <input
          className="form-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={function (e) {
            setPassword(e.target.value);
          }}
        />

        {error && <span className="error-text">{error}</span>}

        <button className="btn-primary" onClick={handleLogin}>
          Login
        </button>

        <p className="link-text">
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

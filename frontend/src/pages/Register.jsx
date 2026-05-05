import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

var BACKEND = "http://localhost:5000/api";

function Register() {
  var [name, setName] = useState("");
  var [email, setEmail] = useState("");
  var [password, setPassword] = useState("");
  var [error, setError] = useState("");

  var navigate = useNavigate();

  function handleRegister() {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    fetch(BACKEND + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, email: email, password: password }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (data.message === "Account created successfully.") {
          alert("Account created! Please login.");
          navigate("/login");
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
        <h4>Register</h4>
        <p className="sub">Create your account</p>

        <input
          className="form-input"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={function (e) {
            setName(e.target.value);
          }}
        />

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

        <button className="btn-primary" onClick={handleRegister}>
          Register
        </button>

        <p className="link-text">
          Already have account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

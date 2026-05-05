import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";

var BACKEND = "http://localhost:5000/api";

function Dashboard() {
  var [taskList, setTaskList] = useState([]);
  var [title, setTitle] = useState("");
  var [desc, setDesc] = useState("");
  var [error, setError] = useState("");
  var [activeFilter, setFilter] = useState("all");

  var navigate = useNavigate();
  var token = localStorage.getItem("token");
  var userName = localStorage.getItem("userName");

  // useEffect ke andar seedha fetch likha hai
  // koi alag function nahi - isliye warning nahi aayegi
  useEffect(
    function () {
      if (!token) {
        navigate("/login");
        return;
      }

      fetch(BACKEND + "/tasks", {
        headers: { Authorization: "Bearer " + token },
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          setTaskList(data);
        })
        .catch(function () {
          alert("Could not load tasks. Check if backend is running.");
        });
    },
    [token, navigate],
  );

  function submitTask() {
    if (!title.trim()) {
      setError("Title cannot be empty!");
      return;
    }
    setError("");

    fetch(BACKEND + "/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title: title, description: desc }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (saved) {
        setTaskList(function (prev) {
          return [...prev, saved];
        });
        setTitle("");
        setDesc("");
        setFilter("all");
      })
      .catch(function () {
        alert("Could not add task.");
      });
  }

  function toggleStatus(id, currentStatus) {
    var newStatus = currentStatus === "pending" ? "completed" : "pending";

    fetch(BACKEND + "/tasks/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function () {
        setTaskList(function (prev) {
          return prev.map(function (t) {
            if (t._id === id) {
              return { ...t, status: newStatus };
            }
            return t;
          });
        });
      })
      .catch(function () {
        alert("Could not update task.");
      });
  }

  function removeTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    fetch(BACKEND + "/tasks/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })
      .then(function () {
        setTaskList(function (prev) {
          return prev.filter(function (t) {
            return t._id !== id;
          });
        });
      })
      .catch(function () {
        alert("Could not delete task.");
      });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  }

  // Filter the task list
  var filteredList = taskList;
  if (activeFilter === "pending") {
    filteredList = taskList.filter(function (t) {
      return t.status === "pending";
    });
  } else if (activeFilter === "completed") {
    filteredList = taskList.filter(function (t) {
      return t.status === "completed";
    });
  }

  var total = taskList.length;
  var pending = taskList.filter(function (t) {
    return t.status === "pending";
  }).length;
  var completed = taskList.filter(function (t) {
    return t.status === "completed";
  }).length;

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <span className="brand">Project Management System</span>
        <div className="nav-right">
          <span className="welcome-text">Hello, {userName}</span>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-num">{total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-box">
            <div className="stat-num yellow">{pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-box">
            <div className="stat-num green">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="form-box">
          <h5>Add New Task</h5>
          <input
            className="form-input"
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={function (e) {
              setTitle(e.target.value);
            }}
          />
          {error && <span className="error-text">{error}</span>}
          <textarea
            className="form-input"
            placeholder="Enter description (optional)"
            value={desc}
            onChange={function (e) {
              setDesc(e.target.value);
            }}
            rows={2}
          />
          <button className="btn-add" onClick={submitTask}>
            Add Task
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="filter-row">
          <button
            className={
              activeFilter === "all" ? "filter-btn active" : "filter-btn"
            }
            onClick={function () {
              setFilter("all");
            }}
          >
            All
          </button>
          <button
            className={
              activeFilter === "pending" ? "filter-btn active" : "filter-btn"
            }
            onClick={function () {
              setFilter("pending");
            }}
          >
            Pending
          </button>
          <button
            className={
              activeFilter === "completed" ? "filter-btn active" : "filter-btn"
            }
            onClick={function () {
              setFilter("completed");
            }}
          >
            Completed
          </button>
        </div>

        {/* Task List */}
        {filteredList.length === 0 && (
          <p className="no-task">No tasks found.</p>
        )}

        {filteredList.map(function (task) {
          return (
            <TaskCard
              key={task._id}
              task={task}
              onToggle={toggleStatus}
              onDelete={removeTask}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;

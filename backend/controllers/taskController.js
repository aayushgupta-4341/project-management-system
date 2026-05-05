const Task = require("../models/Task");

function getTasks(req, res) {
  Task.find({ userId: req.userId })
    .then(function (tasks) {
      res.json(tasks);
    })
    .catch(function (err) {
      res
        .status(500)
        .json({ message: "Could not fetch tasks.", error: err.message });
    });
}

function addTask(req, res) {
  if (!req.body.title) {
    return res.status(400).json({ message: "Title is required." });
  }

  var newTask = new Task({
    title: req.body.title,
    description: req.body.description || "",
    status: "pending",
    userId: req.userId,
  });

  newTask
    .save()
    .then(function (saved) {
      res.status(201).json(saved);
    })
    .catch(function (err) {
      res
        .status(500)
        .json({ message: "Could not add task.", error: err.message });
    });
}

function updateTask(req, res) {
  Task.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  )
    .then(function (updated) {
      res.json(updated);
    })
    .catch(function (err) {
      res
        .status(500)
        .json({ message: "Could not update task.", error: err.message });
    });
}

function deleteTask(req, res) {
  Task.findByIdAndDelete(req.params.id)
    .then(function () {
      res.json({ message: "Task deleted." });
    })
    .catch(function (err) {
      res
        .status(500)
        .json({ message: "Could not delete task.", error: err.message });
    });
}

module.exports = { getTasks, addTask, updateTask, deleteTask };

function TaskCard({ task, onToggle, onDelete }) {
  return (
    <div
      className={
        task.status === "completed" ? "task-card completed" : "task-card"
      }
    >
      <div className="task-top">
        <span className="task-title">{task.title}</span>
        <span className={"badge " + task.status}>{task.status}</span>
      </div>

      {task.description && <p className="task-desc">{task.description}</p>}

      <div className="task-btns">
        <button
          className="btn-complete"
          onClick={function () {
            onToggle(task._id, task.status);
          }}
        >
          {task.status === "pending" ? "Mark Complete" : "Mark Pending"}
        </button>
        <button
          className="btn-delete"
          onClick={function () {
            onDelete(task._id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;

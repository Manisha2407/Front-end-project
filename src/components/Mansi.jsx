import React, { useState, useEffect } from "react";
import "../styles/mansi.css";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";

const Mansi = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState("light");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("planforge-tasks") || "[]");
    setTasks(savedTasks);
    const savedTheme = localStorage.getItem("planforge-theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("planforge-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("planforge-theme", theme);
  }, [theme]);

  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showNotification("Task title is required", "error");
      return;
    }
    if (title.trim().length < 3) {
      showNotification("Task title must be at least 3 characters", "error");
      return;
    }
    const newTask = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    showNotification("Task added successfully!", "success");
  };

  const launchConfetti = () => {
    const duration = 1 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    const toggledTask = tasks.find((t) => t.id === id);
    if (toggledTask) {
      if (!toggledTask.completed) {
        // Marking as completed
        showNotification("Congratulations! Your task has been completed 🎉", "success");
        launchConfetti();
        setTimeout(() => {
          alert("🎉 Congratulations! Your task has been completed!");
        }, 400);
      } else {
        // Marking as pending
        showNotification("Task marked as pending again", "success");
      }
    }
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== id));
      showNotification("Task deleted successfully", "success");
    }
  };

  const filteredTasks = () => {
    switch (filter) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "pending":
        return tasks.filter((task) => !task.completed);
      case "high":
        return tasks.filter((task) => task.priority === "high");
      default:
        return tasks;
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const showNotification = (message, type) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="page-container">
      <div className="centered-card">
        {/* Header */}
        <header className="card-header">
          <nav className="navbar">
            <Link to="/" className="nav-logo">
              <span className="logo-icon">⚒️</span> PlanForge
            </Link>
            <div className="nav-actions">
              <Link to="/Main" className="nav-btn">Back to DashBoard</Link>
              <button className="theme-toggle" onClick={toggleTheme}>
                {theme === "light" ? "🌙" : "☀️"}
              </button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="card-content">
          {/* Task Form */}
          <section className="form-section">
            <h2 className="section-title">Add New Task</h2>
            <form className="task-form" onSubmit={addTask}>
              <div className="form-group">
                <label htmlFor="taskTitle" className="form-label">Task Title *</label>
                <input
                  type="text"
                  id="taskTitle"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskDescription" className="form-label">Description</label>
                <textarea
                  id="taskDescription"
                  className="form-input form-textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add task description (optional)"
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="taskPriority" className="form-label">Priority</label>
                  <select
                    id="taskPriority"
                    className="form-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="taskDueDate" className="form-label">Due Date</label>
                  <input
                    type="date"
                    id="taskDueDate"
                    className="form-input"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">Add Task</button>
            </form>
          </section>

          {/* Statistics */}
          <section className="stats-section">
            <h2 className="section-title">Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">{totalTasks}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{completedTasks}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{pendingTasks}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </section>

          {/* Task List */}
          <section className="task-list-section">
            <div className="task-list-container">
              <div className="filters-wrapper">
                {["all", "pending", "completed", "high"].map((f) => (
                  <button
                    key={f}
                    className={`filter-btn ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {filteredTasks().length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No tasks yet</h3>
                  <p>Create your first task to get started!</p>
                </div>
              ) : (
                <div className="tasks-container">
                  {filteredTasks().map((task) => (
                    <div
                      key={task.id}
                      className={`task-card ${task.completed ? "completed" : ""} priority-${task.priority}`}
                    >
                      <div className="task-body">
                        <div
                          className={`task-checkbox ${task.completed ? "checked" : ""}`}
                          onClick={() => toggleTask(task.id)}
                        ></div>
                        <div className="task-content">
                          <div className="task-title">{task.title}</div>
                          {task.description && (
                            <div className="task-description">{task.description}</div>
                          )}
                          <div className="task-meta">
                            <span className={`task-badge priority-${task.priority}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                            {task.dueDate && (
                              <span
                                className={`task-badge due-date ${
                                  new Date(task.dueDate) < new Date() && !task.completed
                                    ? "overdue"
                                    : ""
                                }`}
                              >
                                {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className="task-delete-btn"
                          onClick={() => deleteTask(task.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="card-footer">
          <p>&copy; 2025 PlanForge.</p>
        </footer>
      </div>

      {/* Notifications */}
      <div className="notifications-container">
        {notifications.map((n) => (
          <div key={n.id} className={`notification ${n.type}`}>
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mansi;


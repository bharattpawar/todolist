import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiCheck, FiFlag, FiArrowUp, FiArrowDown } from "react-icons/fi";
import "../styles/Todo_task.css";

const Todo_task = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [hoveredButton, setHoveredButton] = useState(null);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        text: inputValue,
        completed: false,
        priority,
        id: Date.now()
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
      setPriority("medium");
    }
  };

  const handleToggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handlePriorityChange = (id, newPriority) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, priority: newPriority } : todo
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    if (filter === "high") return todo.priority === "high";
    if (filter === "medium") return todo.priority === "medium";
    if (filter === "low") return todo.priority === "low";
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#ff4444";
      case "medium": return "#ffbb33";
      case "low": return "#00C851";
      default: return "#aaaaaa";
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high": return "High Priority";
      case "medium": return "Medium Priority";
      case "low": return "Low Priority";
      default: return "Priority";
    }
  };

  return (
    <div className="modern-container">
      <div className="glass-card">
        <h1>
          <FiCheck className="header-icon" />
          TaskFlow
        </h1>
        <p className="subtitle">Modern task management for productive people</p>
        
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className="modern-input"
          />
          <div className="priority-selector">
            <button 
              className={`priority-btn ${priority === "high" ? "active" : ""}`}
              onClick={() => setPriority("high")}
              style={{ backgroundColor: priority === "high" ? getPriorityColor("high") : "" }}
              onMouseEnter={() => setHoveredButton("high")}
              onMouseLeave={() => setHoveredButton(null)}
              aria-label="High priority"
            >
              <FiArrowUp />
              {hoveredButton === "high" && <span className="tooltip">High Priority</span>}
            </button>
            <button 
              className={`priority-btn ${priority === "medium" ? "active" : ""}`}
              onClick={() => setPriority("medium")}
              style={{ backgroundColor: priority === "medium" ? getPriorityColor("medium") : "" }}
              onMouseEnter={() => setHoveredButton("medium")}
              onMouseLeave={() => setHoveredButton(null)}
              aria-label="Medium priority"
            >
              —
              {hoveredButton === "medium" && <span className="tooltip">Medium Priority</span>}
            </button>
            <button 
              className={`priority-btn ${priority === "low" ? "active" : ""}`}
              onClick={() => setPriority("low")}
              style={{ backgroundColor: priority === "low" ? getPriorityColor("low") : "" }}
              onMouseEnter={() => setHoveredButton("low")}
              onMouseLeave={() => setHoveredButton(null)}
              aria-label="Low priority"
            >
              <FiArrowDown />
              {hoveredButton === "low" && <span className="tooltip">Low Priority</span>}
            </button>
          </div>
          <button 
            onClick={handleAddTodo} 
            className="add-btn"
            onMouseEnter={() => setHoveredButton("add")}
            onMouseLeave={() => setHoveredButton(null)}
            aria-label="Add task"
          >
            <FiPlus />
            {hoveredButton === "add" && <span className="tooltip">Add Task</span>}
          </button>
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            <FiCheck /> All
          </button>
          <button 
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            <FiFlag /> Active
          </button>
          <button 
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            <FiCheck /> Completed
          </button>
          <button 
            className={`filter-btn ${filter === "high" ? "active" : ""}`}
            onClick={() => setFilter("high")}
          >
            <FiArrowUp /> High
          </button>
        </div>

        <ul className="task-list">
          {filteredTodos.length > 0 ? (
            filteredTodos.map(todo => (
              <li 
                key={todo.id} 
                className={`task-item ${todo.completed ? "completed" : ""}`}
                style={{ borderLeft: `4px solid ${getPriorityColor(todo.priority)}` }}
              >
                <div className="task-content">
                  <button 
                    className={`complete-btn ${todo.completed ? "checked" : ""}`}
                    onClick={() => handleToggleComplete(todo.id)}
                    aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {todo.completed && <FiCheck />}
                  </button>
                  <span onClick={() => handleToggleComplete(todo.id)}>
                    {todo.text}
                    <span className="priority-label">
                      ({getPriorityLabel(todo.priority)})
                    </span>
                  </span>
                </div>
                <div className="task-actions">
                  <div className="priority-indicator">
                    <FiFlag color={getPriorityColor(todo.priority)} />
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="delete-btn"
                    aria-label="Delete task"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <div className="empty-state">
              <p>No tasks found. Add one above!</p>
            </div>
          )}
        </ul>

        {todos.length > 0 && (
          <div className="stats">
            <span>
              <FiFlag /> {todos.filter(todo => !todo.completed).length} remaining
            </span>
            <span>
              <FiCheck /> {todos.filter(todo => todo.completed).length} completed
            </span>
            <button 
              className="clear-btn"
              onClick={() => setTodos(todos.filter(todo => !todo.completed))}
            >
              <FiTrash2 /> Clear completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo_task;
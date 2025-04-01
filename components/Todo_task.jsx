import React, { useState, useEffect } from "react";
import {
  FiPlus, FiTrash2, FiCheck, FiFlag, 
  FiArrowUp, FiArrowDown, FiCalendar,
  FiBook, FiMessageSquare, FiRefreshCw, FiAlertCircle
} from "react-icons/fi";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { 
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import "../styles/Todo_task.css";

function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

const Todo_task = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [hoveredButton, setHoveredButton] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [note, setNote] = useState("");
  const [quote, setQuote] = useState("Stay productive and accomplish your tasks!");
  const [quoteAuthor, setQuoteAuthor] = useState("TaskFlow");
  const [quoteError, setQuoteError] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [calendarError, setCalendarError] = useState(null);
  const [notionConnected, setNotionConnected] = useState(false);
  const [notionError, setNotionError] = useState(null);
  const [todoistConnected, setTodoistConnected] = useState(false);
  const [syncingTodoist, setSyncingTodoist] = useState(false);
  const [todoistError, setTodoistError] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error("Error loading saved todos:", error);
      }
    }
    fetchRandomQuote();
    fetchCalendarEvents();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  }, [todos]);

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }
      const data = await response.json();
      setQuote(data.content);
      setQuoteAuthor(data.author);
      setQuoteError(null);
    } catch (error) {
      setQuoteError(error.message || 'Failed to fetch quote');
      setQuote("Stay productive and keep accomplishing your tasks!");
      setQuoteAuthor("TaskFlow");
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      
      const mockEvents = [
        { 
          id: 1, 
          summary: 'Team Standup', 
          start: { 
            dateTime: new Date(
              now.getFullYear(), 
              now.getMonth(), 
              now.getDate(), 
              10, 0, 0
            ).toISOString() 
          },
          end: {
            dateTime: new Date(
              now.getFullYear(), 
              now.getMonth(), 
              now.getDate(), 
              10, 30, 0
            ).toISOString()
          }
        },
        { 
          id: 2, 
          summary: 'Lunch Break', 
          start: { 
            dateTime: new Date(
              now.getFullYear(), 
              now.getMonth(), 
              now.getDate(), 
              12, 30, 0
            ).toISOString() 
          },
          end: {
            dateTime: new Date(
              now.getFullYear(), 
              now.getMonth(), 
              now.getDate(), 
              13, 30, 0
            ).toISOString()
          }
        }
      ].filter(event => {
        const eventStart = new Date(event.start.dateTime);
        return eventStart >= todayStart && eventStart < todayEnd;
      });
      
      setCalendarEvents(mockEvents);
      setCalendarError(null);
    } catch (error) {
      setCalendarError('Failed to load calendar events');
    }
  };

  const connectNotion = () => {
    try {
      setNotionConnected(true);
      setNotionError(null);
    } catch (error) {
      setNotionError('Failed to connect to Notion');
    }
  };

  const syncWithTodoist = async () => {
    setSyncingTodoist(true);
    setTodoistError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTodoistConnected(true);
    } catch (error) {
      setTodoistError('Failed to sync with Todoist');
    } finally {
      setSyncingTodoist(false);
    }
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo = {
        text: inputValue,
        completed: false,
        priority,
        id: Date.now(),
        note: ""
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
      setPriority("medium");
      fetchRandomQuote();
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

  const handleAddNote = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, note } : todo
    ));
    setSelectedTodo(null);
    setNote("");
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
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
          TaskFlow Pro
        </h1>
        <p className="subtitle">Modern task management with powerful integrations</p>
        
        <div className="quote-container">
          <p className="quote-text">"{quote}"</p>
          <p className="quote-author">— {quoteAuthor}</p>
          <button onClick={fetchRandomQuote} className="refresh-quote">
            <FiRefreshCw />
          </button>
          {quoteError && <p className="error-text"><FiAlertCircle /> {quoteError}</p>}
        </div>

        <div className="calendar-events">
          <div className="calendar-header">
            <FiCalendar style={{ color: '#00C851' }} />
            <h3>Today's Events</h3>
          </div>
          {calendarEvents.length > 0 ? (
            <ul className="event-list">
              {calendarEvents.map(event => {
                const startTime = new Date(event.start.dateTime);
                const endTime = new Date(event.end.dateTime);
                
                return (
                  <li key={event.id} className="event-item">
                    <span className="event-time">
                      {startTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} - {endTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    <span className="event-title">
                      {event.summary}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="no-events">
              No events scheduled for today. Click "Refresh Calendar" to check again.
            </p>
          )}
          {calendarError && (
            <p className="error-text">
              <FiAlertCircle /> {calendarError}
            </p>
          )}
        </div>

        <div className="integration-buttons">
          <button 
            onClick={fetchCalendarEvents} 
            className="integration-btn calendar-btn"
          >
            <FiRefreshCw /> Refresh Calendar
          </button>
          <button 
            onClick={connectNotion} 
            className={`integration-btn ${notionConnected ? 'connected' : ''}`}
          >
            <FiBook /> {notionConnected ? 'Notion Connected' : 'Connect Notion'}
          </button>
          <button 
            onClick={syncWithTodoist} 
            className={`integration-btn ${todoistConnected ? 'connected' : ''}`} 
            disabled={syncingTodoist}
          >
            {syncingTodoist ? 'Syncing...' : <><FiMessageSquare /> {todoistConnected ? 'Todoist Synced' : 'Sync Todoist'}</>}
          </button>
        </div>
        {notionError && <p className="error-text"><FiAlertCircle /> {notionError}</p>}
        {todoistError && <p className="error-text"><FiAlertCircle /> {todoistError}</p>}

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
            >
              <FiArrowDown />
              {hoveredButton === "low" && <span className="tooltip">Low Priority</span>}
            </button>
          </div>
          <button onClick={handleAddTodo} className="add-btn">
            <FiPlus />
            {hoveredButton === "add" && <span className="tooltip">Add Task</span>}
          </button>
        </div>

        <div className="filter-buttons">
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            <FiCheck /> All
          </button>
          <button className={`filter-btn ${filter === "active" ? "active" : ""}`} onClick={() => setFilter("active")}>
            <FiFlag /> Active
          </button>
          <button className={`filter-btn ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>
            <FiCheck /> Completed
          </button>
          <button className={`filter-btn ${filter === "high" ? "active" : ""}`} onClick={() => setFilter("high")}>
            <FiArrowUp /> High
          </button>
        </div>

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={filteredTodos.map(todo => todo.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="task-list">
              {filteredTodos.length > 0 ? (
                filteredTodos.map(todo => (
                  <SortableItem key={todo.id} id={todo.id}>
                    <li 
                      className={`task-item ${todo.completed ? "completed" : ""}`}
                      style={{ borderLeft: `4px solid ${getPriorityColor(todo.priority)}` }}
                    >
                      <div className="task-content">
                        <button 
                          className={`complete-btn ${todo.completed ? "checked" : ""}`}
                          onClick={() => handleToggleComplete(todo.id)}
                        >
                          {todo.completed && <FiCheck />}
                        </button>
                        <span onClick={() => handleToggleComplete(todo.id)}>
                          {todo.text}
                          <span className="priority-label">({getPriorityLabel(todo.priority)})</span>
                        </span>
                      </div>
                      <div className="task-actions">
                        {todo.note && (
                          <button onClick={() => setSelectedTodo(todo)} className="note-btn">
                            <FiBook />
                          </button>
                        )}
                        <div className="priority-indicator">
                          <FiFlag color={getPriorityColor(todo.priority)} />
                        </div>
                        <button onClick={() => handleDeleteTodo(todo.id)} className="delete-btn">
                          <FiTrash2 />
                        </button>
                      </div>
                    </li>
                  </SortableItem>
                ))
              ) : (
                <div className="empty-state">
                  <p>No tasks found. Add one above!</p>
                </div>
              )}
            </ul>
          </SortableContext>
        </DndContext>

        {todos.length > 0 && (
          <div className="stats">
            <span><FiFlag /> {todos.filter(todo => !todo.completed).length} remaining</span>
            <span><FiCheck /> {todos.filter(todo => todo.completed).length} completed</span>
            <button className="clear-btn" onClick={() => setTodos(todos.filter(todo => !todo.completed))}>
              <FiTrash2 /> Clear completed
            </button>
          </div>
        )}

        {selectedTodo && (
          <div className="modal-overlay">
            <div className="note-modal">
              <h3>Note for: {selectedTodo.text}</h3>
              {selectedTodo.note ? (
                <div className="note-content">
                  <p>{selectedTodo.note}</p>
                  <button onClick={() => { setNote(selectedTodo.note); setSelectedTodo({...selectedTodo, note: ""}); }} className="edit-note-btn">
                    Edit Note
                  </button>
                </div>
              ) : (
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a note for this task..."
                  className="note-textarea"
                />
              )}
              <div className="modal-actions">
                <button onClick={() => { if (note.trim()) { handleAddNote(selectedTodo.id); } else { setSelectedTodo(null); } }} className="save-note-btn">
                  {selectedTodo.note ? 'Close' : 'Save Note'}
                </button>
                <button onClick={() => { setSelectedTodo(null); setNote(""); }} className="cancel-note-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo_task;

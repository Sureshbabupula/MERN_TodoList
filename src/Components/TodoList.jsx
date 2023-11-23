import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTasks, FaEdit, FaTrash, FaClock } from "react-icons/fa";
import EditTodoForm from "./EditTodoForm";
import "./TodoList.css";

function TodoList() {
  const [arr, setArr] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("https://todobackend-zbvg.onrender.com/todoRoute")
      .then((res) => {
        if (res.status === 200) {
          setArr(res.data);
        } else {
          Promise.reject();
        }
      })
      .catch((err) => alert(err));
  };

  const handleEditTodo = (todoId) => {
    setSelectedTodo(todoId);
    setIsEditFormVisible(true);
  };

  const handleUpdate = () => {
    setIsEditFormVisible(false);
    fetchData();
  };

  const handleDeleteConfirmation = (todoId) => {
    setSelectedTodo(todoId);
    setIsDeleteConfirmationVisible(true);
  };

  const handleDeleteTodo = async () => {
    try {
      await axios.delete(
        `https://todobackend-zbvg.onrender.com/todoRoute/delete-todo/${selectedTodo}`
      );

      // Remove the deleted todo from the state
      const updatedArr = arr.filter((todo) => todo._id !== selectedTodo);
      setArr(updatedArr);

      // Reset selectedTodo and hide the delete confirmation modal
      setSelectedTodo(null);
      setIsDeleteConfirmationVisible(false);

      alert("Todo deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo: ", error);
      alert("Error deleting todo. Please try again.");
    }
  };

  const handleCancelDelete = () => {
    setSelectedTodo(null);
    setIsDeleteConfirmationVisible(false);
  };

  const formatDateTime = (createdAt) => {
    if (!createdAt) {
      return "Date Not Available";
    }

    const dateObject = new Date(createdAt);

    // Get date in "YYYY-MM-DD" format
    const formattedDate = dateObject.toISOString().split("T")[0];

    // Get time in "HH:mm" format
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const formattedTime = `${hours}:${minutes}`;

    // Combine date and time
    const formattedDateTime = `${formattedDate} ${formattedTime}`;

    return formattedDateTime;
  };

  return (
    <div className="card-container">
      {arr.map((todo, index) => (
        <div
          className={`card ${index % 2 === 0 ? "even" : "odd"}`}
          key={todo._id}
        >
          <h2 className={`todo-name ${todo.isRead ? "read" : ""}`}>
            {todo.isRead && <span className="tick-mark">&#10004;</span>}
            <FaTasks className="icon" /> {todo.TodoName}
          </h2>

          <p
            className={`description ${
              index % 2 === 0 ? "light-bg" : "dark-bg"
            }`}
          >
            {todo.Description}
          </p>
          <div className="created-at">
            <FaClock className="icon" /> Created At:{" "}
            {formatDateTime(todo.CreatedAt)}
          </div>
          <div className="button-container">
            <button
              className="edit-button"
              onClick={() => handleEditTodo(todo._id)}
            >
              <FaEdit className="button-icon" /> Edit
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteConfirmation(todo._id)}
            >
              <FaTrash className="button-icon" /> Delete
            </button>
            {!todo.isRead && (
              <button
                className="mark-as-read-button"
                onClick={() => {
                  const updatedArr = arr.map((t) =>
                    t._id === todo._id ? { ...t, isRead: true } : t
                  );
                  setArr(updatedArr);
                }}
              >
                Mark as Read
              </button>
            )}
          </div>
        </div>
      ))}
      {isEditFormVisible && (
        <div className="edit-form-overlay">
          <EditTodoForm
            todoId={selectedTodo}
            onClose={() => setIsEditFormVisible(false)}
            onUpdate={handleUpdate}
          />
        </div>
      )}
      {isDeleteConfirmationVisible && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <p>Are you sure you want to delete the Todo?</p>
            <div className="button-container-form">
              <button onClick={handleDeleteTodo}>Yes, Delete</button>
              <button onClick={handleCancelDelete}>No, Keep</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;

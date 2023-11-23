import React, { useState } from "react";
import Axios from "axios";
import DesktopNotification from "./DesktopNotification"; 

const TodoAddForm = () => {
  const [TodoName, setTodoName] = useState("");
  const [Description, setDescription] = useState("");

  const handleAddTodo = async (event) => {
    event.preventDefault();

    try {
      const response = await Axios.post("https://todobackend-zbvg.onrender.com/todoRoute/create-todo", {
        TodoName,
        Description,
      });

      if (response.status === 200) {
        // Display the web notification
        DesktopNotification.showNotification();

        alert("Todo added successfully!");
        setTodoName("");
        setDescription("");
      } else {
        Promise.reject();
      }
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleAddTodo} className="bg-light p-5 rounded shadow">
        <h2 className="text-center mb-4">Add New Todo</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Todo Name"
            value={TodoName}
            onChange={(e) => setTodoName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder="Todo Description"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Todo
        </button>
      </form>
    </div>
  );
};

export default TodoAddForm;

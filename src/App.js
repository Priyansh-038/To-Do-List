import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [newTask, setNewTask] = useState('');
  const [taskList, setTaskList] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [filterOption, setFilterOption] = useState('all');
  const [sortOption, setSortOption] = useState('newest');

  const [taskBeingEditedId, setTaskBeingEditedId] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(taskList));
  }, [taskList]);

  const handleAddTask = () => {
    const trimmedText = newTask.trim();
    if (!trimmedText) {
      alert('Task cannot be empty!');
      return;
    }

    const taskObject = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
    };

    setTaskList([taskObject, ...taskList]);
    setNewTask('');
  };

  const handleDeleteTask = (taskId) => {
    setTaskList(taskList.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId) => {
    const updatedTasks = taskList.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTaskList(updatedTasks);
  };

  const beginEditingTask = (taskId, currentText) => {
    setTaskBeingEditedId(taskId);
    setEditedText(currentText);
  };

  const saveEditedTask = (taskId) => {
    const updatedTasks = taskList.map(task =>
      task.id === taskId ? { ...task, text: editedText } : task
    );
    setTaskList(updatedTasks);
    setTaskBeingEditedId(null);
    setEditedText('');
  };

  const getVisibleTasks = () => {
    let visibleTasks = [...taskList];

    if (filterOption === 'completed') {
      visibleTasks = visibleTasks.filter(task => task.completed);
    } else if (filterOption === 'pending') {
      visibleTasks = visibleTasks.filter(task => !task.completed);
    }

    if (sortOption === 'oldest') {
      visibleTasks.reverse();
    }

    return visibleTasks;
  };

  return (
    <div className="todo-container">
      <h2>To-Do List</h2>

      <div className="input-group">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddTask()}
          placeholder="Enter a new task"
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <div className="controls">
        <select value={filterOption} onChange={e => setFilterOption(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <ul className="task-list">
        {getVisibleTasks().map(task => (
          <li
            key={task.id}
            className={`task-box ${task.completed ? 'completed-task' : 'incomplete-task'}`}
          >
            <label className="task-left">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task.id)}
              />

              {taskBeingEditedId === task.id ? (
                <input
                  className="edit-input"
                  value={editedText}
                  onChange={e => setEditedText(e.target.value)}
                  onBlur={() => saveEditedTask(task.id)}
                  onKeyDown={e => e.key === 'Enter' && saveEditedTask(task.id)}
                  autoFocus
                />
              ) : (
                <span>{task.text}</span>
              )}
            </label>

            <div className="task-actions">
              <button title="Edit Task" onClick={() => beginEditingTask(task.id, task.text)}>🖉</button>
              <button title="Delete Task" onClick={() => handleDeleteTask(task.id)}>🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

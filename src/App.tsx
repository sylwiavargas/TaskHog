import { useEffect, useState } from "react";
import { PostHogFeature, usePostHog } from "posthog-js/react";
import "./App.css";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Default tasks for hogs
const getDefaultTasks = (): Todo[] => {
  return [
    { id: 1, text: "Forage for snacks", completed: false },
    { id: 2, text: "Roll into a ball", completed: false },
    { id: 3, text: "Explore the hedge", completed: false },
    { id: 4, text: "Start a hedge fund", completed: false },
    { id: 5, text: "Nap time", completed: true },
  ];
};

function App() {
  const [todos, setTodos] = useState<Todo[]>(getDefaultTasks());
  const [inputValue, setInputValue] = useState("");
  const posthog = usePostHog();
  useEffect(() => {
    const id = "123";
    posthog.identify(id, [
      {
        name: "John Doe",
        email: "john.doe@example.com",
      },
    ]);
  }, [posthog]);

  const addTodo = () => {
    if (inputValue.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const markAllComplete = () => {
    setTodos(todos.map((todo) => ({ ...todo, completed: true })));
  };

  return (
    <div className="app">
      <h1>TaskHog</h1>

      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button onClick={addTodo} className="add-button">
          Add
        </button>
      </div>

      <div className="todos-list">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <span className="todo-text">{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <PostHogFeature flag="mark-all-complete" match={true}>
        {todos.length > 0 && (
          <button onClick={markAllComplete} className="mark-all-button">
            Mark all complete
          </button>
        )}
      </PostHogFeature>

      {todos.length === 0 && (
        <p className="empty-state">No tasks yet. Add one above!</p>
      )}

      <img
        src="https://res.cloudinary.com/dmukukwp6/image/upload/v1710055416/posthog.com/contents/images/media/social-media-headers/hogs/builder_hog.png"
        alt="Hog Builder"
        className="hog-builder"
      />
    </div>
  );
}

export default App;

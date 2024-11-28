import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import CreateBook from "./pages/CreateBook";
import Home from "./pages/Home";
import EditAuthor from "./pages/EditAuthor";
import EditBook from "./pages/EditBook";
import CreateAuthor from "./pages/CreateAuthor";
import Books from "./pages/Books";
import Authors from "./pages/Authors";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header />
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/books/create" element={<CreateBook />} />
          <Route path="/authors/create" element={<CreateAuthor />} />
          <Route path="/authors/edit/:id" element={<EditAuthor />} />
          <Route path="/books/edit/:id" element={<EditBook />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

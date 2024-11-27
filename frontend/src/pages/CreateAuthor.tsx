import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book } from "./CreateBook";

export interface Author {
  id: string | undefined; // Allow undefined for new authors
  name: string;
  books?: Book[];
}

interface CreateAuthorProps {
  initialData?: Author; // Optional props for editing
  onSubmit?: (data: Author) => void; // Callback for submitting form
}

const CreateAuthor: React.FC<CreateAuthorProps> = ({
  initialData,
  onSubmit,
}) => {
  const [name, setName] = useState(initialData?.name || ""); // Pre-fill the name if available
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authorData = { id: initialData?.id, name }; // Include ID if editing

    if (onSubmit) {
      // Pass the form data to the parent component
      onSubmit(authorData);
    } else {
      // Default POST for create
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/author`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(authorData),
        }
      );
      if (response.ok) {
        navigate("/");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {initialData ? "Edit Author" : "Create Author"}
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="flex gap-4">
        <Link
          to="/"
          className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Back
        </Link>
        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CreateAuthor;

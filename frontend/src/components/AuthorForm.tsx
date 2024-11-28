import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Book } from "./BookForm";
import { usePopup } from "../utils/PopupProvider";

export interface Author {
  id: string | undefined;
  name: string;
  books?: Book[];
}

interface AuthorFormProps {
  initialData?: Author;
  onSubmit?: (data: Author) => void;
}

const AuthorForm: React.FC<AuthorFormProps> = ({ initialData, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || "");
  const navigate = useNavigate();
  const { openPopup, closePopup } = usePopup();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const authorData = { id: initialData?.id, name };

    if (onSubmit) {
      onSubmit(authorData);
    } else {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/authors`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(authorData),
        }
      );
      if (response.ok) {
        navigate("/authors");
      } else {
        const errorMessage =
          response.status === 409
            ? "Author already exist"
            : "An error occurred while creating the author.";
        openPopup({
          title: "Error",
          content: (
            <>
              <p>{errorMessage}</p>
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closePopup}
              >
                Ok
              </button>
            </>
          ),
        });
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
          to="/authors"
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

export default AuthorForm;

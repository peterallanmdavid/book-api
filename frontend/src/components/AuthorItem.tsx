import React from "react";
import { Author } from "./AuthorForm";

interface AuthorItemProps {
  author: Author;
  onEdit: (author: Author) => void;
  onDelete: (author: Author) => void;
}

const AuthorItem: React.FC<AuthorItemProps> = ({
  author,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border rounded shadow p-4 mb-4 bg-white cursor-pointer hover:shadow-md">
      <h2 className="text-lg font-bold mb-2">{author.name}</h2>
      <p className="text-sm text-gray-500">ID: {author.id}</p>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(author);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(author);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AuthorItem;

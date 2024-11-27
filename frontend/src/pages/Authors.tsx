import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Table from "../components/Table";
import { useNavigate } from "react-router-dom";
import { Book } from "./CreateBook";
import { Author } from "./CreateAuthor";

const fetchAuthors = async (): Promise<Author[]> => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/author`);
  if (!response.ok) throw new Error("Failed to fetch authors");
  return response.json();
};

const deleteAuthor = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/author/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) throw new Error("Failed to delete author");
};

const Authors: React.FC = () => {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: authors,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });

  const mutation = useMutation({
    mutationFn: deleteAuthor,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["authors"],
      });
    },
    onError: (error, variables, context) => {
      console.error("Error deleting author:", error);
    },
  });

  const handleEdit = (author: Author) => {
    navigate(`/authors/edit/${author.id}`); // Navigate to edit author page
  };

  const handleDelete = (author: Author) => {
    if (author?.books?.length && author.books.length > 0) {
      alert("Cannot delete author with books");

      return;
    }
    setSelectedAuthor(author); // Open confirmation popup
  };

  const confirmDelete = () => {
    if (selectedAuthor) {
      mutation.mutate(selectedAuthor?.id!); // Perform delete
      setSelectedAuthor(null); // Close popup
    }
  };

  const columns = [
    { header: "ID", accessor: "id" as keyof Author },
    { header: "Name", accessor: "name" as keyof Author },
    { header: "Actions", accessor: null }, // Action buttons for edit/delete
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Authors</h1>
        <button
          onClick={() => navigate("/authors/create")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create New Author
        </button>
      </div>
      <Table
        columns={columns}
        data={authors || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* @TODO make reusable component*/}
      {selectedAuthor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete the author "{selectedAuthor.name}
              "?
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setSelectedAuthor(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authors;

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Table from "../components/Table";
import { Link, useNavigate } from "react-router-dom";
import { Book } from "./CreateBook";

const fetchBooks = async (): Promise<Book[]> => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/book`);
  if (!response.ok) throw new Error("Failed to fetch books");
  return response.json();
};

const deleteBook = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/book/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) throw new Error("Failed to delete book");
};

const Books: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const navigate = useNavigate();
  const {
    data: books,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  const mutation = useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
    onError: (error, variables, context) => {
      console.error("Error deleting book:", error);
    },
  });

  const handleEdit = (book: Book) => {
    navigate("/books/edit/" + book.id);
  };

  const handleDelete = (book: Book) => {
    setSelectedBook(book);
  };

  const confirmDelete = () => {
    if (selectedBook) {
      mutation.mutate(selectedBook?.id!);
      setSelectedBook(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const columns = [
    { header: "ID", accessor: "id" as keyof Book },
    { header: "Title", accessor: "title" as keyof Book },
    { header: "Author", accessor: "authorId" as keyof Book },
    { header: "Actions", accessor: null }, // Column for buttons
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Books</h1>
        <Link
          to="/books/create"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create New Book
        </Link>
      </div>
      <Table
        columns={columns}
        data={
          books?.map((item) => ({
            ...item,
            authorId: item.author?.name || "",
          })) || []
        }
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* @TODO make reusable component*/}
      {selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete the book "{selectedBook.title}"?
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setSelectedBook(null)}
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

export default Books;

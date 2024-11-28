import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Link, useNavigate } from "react-router-dom";
import { Book } from "../components/BookForm";
import { usePopup } from "../utils/PopupProvider";
import BookItem from "./BookItem";

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

  const { openPopup, closePopup } = usePopup();
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
    openPopup({
      title: "Confirm Delete",
      content: (
        <>
          <p>Are you sure you want to delete the book "{book.title}"?</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => confirmDelete(book)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Yes, Delete
            </button>
            <button
              onClick={closePopup}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </>
      ),
    });
  };

  const confirmDelete = (book: Book) => {
    if (book) {
      mutation.mutate(book?.id!);
      closePopup();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Books</h1>
        <Link
          to="/books/create"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Book
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {!!books && books?.length ? (
          books?.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <>You have not created any books yet, Create one now</>
        )}
      </div>
    </div>
  );
};

export default Books;

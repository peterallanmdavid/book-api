import React from "react";
import { Book } from "./BookForm";
import { Card } from "./Card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../utils/PopupProvider";

interface BookItemProps {
  book: Book;
}

const deleteBook = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/books/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) throw new Error("Failed to delete book");
};

const BookItem: React.FC<BookItemProps> = ({ book }) => {
  const queryClient = useQueryClient();

  const { openPopup, closePopup } = usePopup();
  const navigate = useNavigate();
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

  const handleEdit = () => {
    navigate("/books/edit/" + book.id);
  };

  const handleDelete = () => {
    openPopup({
      title: "Confirm Delete",
      content: (
        <>
          <p>Are you sure you want to delete the book "{book.title}"?</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => confirmDelete()}
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

  const confirmDelete = () => {
    if (book) {
      mutation.mutate(book?.id!);
      closePopup();
    }
  };

  return (
    <Card>
      <h2 className="text-lg font-bold mb-2">{book.title}</h2>
      <p className="text-sm text-gray-500">Author : {book.author?.name}</p>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </Card>
  );
};

export default BookItem;

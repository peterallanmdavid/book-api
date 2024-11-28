import React from "react";
import { Author } from "./AuthorForm";
import { Card } from "./Card";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePopup } from "../utils/PopupProvider";

interface AuthorItemProps {
  author: Author;
}

const deleteAuthor = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/authors/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) throw new Error("Failed to delete author");
};

const AuthorItem: React.FC<AuthorItemProps> = ({ author }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openPopup, closePopup } = usePopup();
  const handleEdit = () => {
    navigate(`/authors/edit/${author.id}`);
  };

  const mutation = useMutation({
    mutationFn: deleteAuthor,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["authors"],
      });
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
    onError: (error, variables, context) => {
      console.error("Error deleting author:", error);
    },
  });

  const confirmDelete = () => {
    if (author) {
      mutation.mutate(author?.id!);
      closePopup();
    }
  };

  const handleDelete = () => {
    if (author?.books?.length && author.books.length > 0) {
      openPopup({
        title: "Confirm Delete",
        content: (
          <>
            <p>
              Deleting this Author will also delete all of its associated Books.
              Are you sure you want to delete the author "{author.name}"?
            </p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => confirmDelete()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Yes, Delete Author and Associated Books
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

      return;
    }
    openPopup({
      title: "Confirm Delete",
      content: (
        <>
          <p>Are you sure you want to delete the author "{author.name}"?</p>
          <div className="flex gap-4 mt-4">
            <button
              onClick={confirmDelete}
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

  return (
    <Card>
      <h2 className="text-lg font-bold mb-2">{author.name}</h2>
      <p className="text-sm text-gray-500">ID: {author.id}</p>

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

export default AuthorItem;

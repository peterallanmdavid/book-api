import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Author } from "../components/AuthorForm";
import { usePopup } from "../utils/PopupProvider";
import AuthorItem from "./AuthorItem";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openPopup, closePopup } = usePopup();

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
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
    },
    onError: (error, variables, context) => {
      console.error("Error deleting author:", error);
    },
  });

  const handleEdit = (author: Author) => {
    navigate(`/authors/edit/${author.id}`);
  };

  const handleDelete = (author: Author) => {
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
                onClick={() => confirmDelete(author)}
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
              onClick={() => confirmDelete(author)}
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

  const confirmDelete = (author: Author) => {
    if (author) {
      mutation.mutate(author?.id!);
      closePopup();
    }
  };

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
          Add Author
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {!!authors && authors?.length ? (
          authors?.map((author) => (
            <AuthorItem
              key={author.id}
              author={author}
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

export default Authors;

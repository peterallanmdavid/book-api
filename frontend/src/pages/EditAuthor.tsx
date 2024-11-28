import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import AuthorForm, { Author } from "../components/AuthorForm";
import { usePopup } from "../utils/PopupProvider";

const fetchAuthorById = async ({
  queryKey,
}: {
  queryKey: [string, string | undefined];
}): Promise<Author> => {
  const [, id] = queryKey;
  if (!id) throw new Error("Author ID is required");
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/authors/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch author");
  }
  return response.json();
};

const updateAuthor = async (author: Author): Promise<void> => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/authors/${author.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(author),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update author");
  }
};

const EditAuthor: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const queryClient = useQueryClient();
  const { openPopup, closePopup } = usePopup();

  const {
    data: author,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["author", id],
    queryFn: fetchAuthorById,
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: updateAuthor,
    onError: (error, variables, context) => {
      console.error("Error updating author:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      openPopup({
        title: "Success",
        content: (
          <>
            <p>The author has been successfully updated!</p>

            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mt-4"
              onClick={() => closePopup()}
            >
              Ok
            </button>
          </>
        ),
      });
    },
  });

  const handleUpdate = (updatedAuthor: Author) => {
    mutation.mutate(updatedAuthor);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="p-8">
      <AuthorForm initialData={author} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditAuthor;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Popup } from "../components/Popup";
import AuthorForm, { Author } from "../components/AuthorForm";

const fetchAuthorById = async ({
  queryKey,
}: {
  queryKey: [string, string | undefined];
}): Promise<Author> => {
  const [, id] = queryKey;
  if (!id) throw new Error("Author ID is required");
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/author/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch author");
  }
  return response.json();
};

const updateAuthor = async (author: Author): Promise<void> => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/author/${author.id}`,
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Fetch the author data by ID
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

  // Mutation for updating the author
  const mutation = useMutation({
    mutationFn: updateAuthor,
    onError: (error, variables, context) => {
      console.error("Error updating author:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] }); // Refresh authors list
      setShowSuccessPopup(true); // Show success popup
    },
  });

  const handleUpdate = (updatedAuthor: Author) => {
    mutation.mutate(updatedAuthor); // Trigger the mutation to update the author
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="p-8">
      <AuthorForm initialData={author} onSubmit={handleUpdate} />

      {showSuccessPopup && (
        <Popup>
          <h2 className="text-xl font-bold mb-4">Success</h2>
          <p>The author has been successfully updated!</p>

          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mt-4"
            onClick={() => setShowSuccessPopup(false)}
          >
            Ok
          </button>
        </Popup>
      )}
    </div>
  );
};

export default EditAuthor;

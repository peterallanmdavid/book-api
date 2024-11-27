import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateAuthor, { Author } from "./CreateAuthor";

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
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000); // Delay for popup visibility
    },
  });

  const handleUpdate = (updatedAuthor: Author) => {
    mutation.mutate(updatedAuthor); // Trigger the mutation to update the author
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="p-8">
      <CreateAuthor initialData={author} onSubmit={handleUpdate} />

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Success</h2>
            <p>The author has been successfully updated!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAuthor;

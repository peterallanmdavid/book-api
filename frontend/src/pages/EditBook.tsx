import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Popup } from "../components/Popup";
import BookForm, { Book } from "../components/BookForm";

const fetchBookById = async ({
  queryKey,
}: {
  queryKey: [string, string | undefined];
}): Promise<Book> => {
  const [, id] = queryKey;
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/book/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }
  return response.json();
};

const updateBook = async (book: Book): Promise<void> => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/book/${book.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update book");
  }
};

const EditBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Fetch book data by ID
  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bookById", id],
    queryFn: fetchBookById,
    enabled: !!id,
  });

  // Mutation for updating the book
  const mutation = useMutation({
    mutationFn: (book: Book) => {
      if (!book.id) {
        throw new Error("Book ID is required");
      }
      return updateBook(book);
    },
    onError: (error, variables, context) => {
      console.error("Error updating book:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] }); // Refresh books list
      setShowSuccessPopup(true); // Show success popup
    },
  });

  const handleUpdate = (updatedBook: Book) => {
    mutation.mutate(updatedBook); // Trigger the mutation to update the book
  };

  const handleCancel = () => {
    navigate("/books"); // Navigate back to books list
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="p-8">
      <BookForm
        initialData={book}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />

      {showSuccessPopup && (
        <Popup>
          <h2 className="text-xl font-bold mb-4">Success</h2>
          <p>The book has been successfully updated!</p>
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

export default EditBook;

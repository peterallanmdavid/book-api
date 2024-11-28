import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Author } from "./AuthorForm";
import { usePopup } from "../utils/PopupProvider";

export interface Book {
  id: string | undefined;
  title: string;
  authorId: string;
  author?: Author;
}

interface BookFormProps {
  initialData?: Book;
  onSubmit?: (data: Book) => void;
  onCancel?: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [authorId, setAuthorId] = useState(initialData?.authorId || "");
  const [authors, setAuthors] = useState<Author[]>([]);
  const navigate = useNavigate();
  const { openPopup, closePopup } = usePopup();

  useEffect(() => {
    const fetchAuthors = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/authors`
      );
      const data = await response.json();
      setAuthors(data?.data);
    };
    fetchAuthors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const bookData: Book = {
        id: initialData?.id || undefined,
        title,
        authorId,
      };

      if (onSubmit) {
        onSubmit(bookData);
      } else {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/books`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookData),
          }
        );

        if (response.ok) {
          navigate("/books");
        } else {
          const errorMessage =
            response.status === 409
              ? "Book already exist"
              : "An error occurred while creating the book.";
          openPopup({
            title: "Error",
            content: (
              <>
                <p>{errorMessage}</p>
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={closePopup}
                >
                  Ok
                </button>
              </>
            ),
          });
        }
      }
    } catch (error) {
      console.error("Error creating book:", error);
      openPopup({
        title: "Error",
        content: (
          <>
            <p>An error occurred while creating the book.</p>
            <p>{(error as Error).message}</p>
          </>
        ),
      });
      closePopup();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        {initialData ? "Edit Book" : "Create Book"}
      </h1>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Author</label>
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        >
          <option value="" disabled>
            Select an Author
          </option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-4">
        <Link
          to="/books"
          className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Back
        </Link>
        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default BookForm;

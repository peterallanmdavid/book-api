import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import { Book } from "../components/BookForm";

import BookItem from "../components/BookItem";

const fetchBooks = async (): Promise<{
  data: Book[];
  totalCount: number;
}> => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/books`);
  if (!response.ok) throw new Error("Failed to fetch books");
  return response.json();
};

const Books: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const books = data?.data;
  return (
    <div className="p-8">
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
          books?.map((book) => <BookItem key={book.id} book={book} />)
        ) : (
          <>You have not created any books yet, Create one now</>
        )}
      </div>
    </div>
  );
};

export default Books;

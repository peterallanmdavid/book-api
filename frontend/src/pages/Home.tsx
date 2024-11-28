import React from "react";

import { useQuery } from "@tanstack/react-query";
import AuthorItem from "../components/AuthorItem";
import { Author } from "../components/AuthorForm";
import { Link } from "react-router-dom";
import { Book } from "../components/BookForm";
import BookItem from "../components/BookItem";

const fetchBooks = async ({
  queryKey,
}: {
  queryKey: [string, number | undefined];
}) => {
  const [_, limit] = queryKey;
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/books?limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch books");
  return response.json();
};

const fetchAuthors = async ({
  queryKey,
}: {
  queryKey: [string, number | undefined];
}) => {
  const [_, limit] = queryKey;
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/authors?limit=${limit}`
  );
  if (!response.ok) throw new Error("Failed to fetch authors");
  return response.json();
};

const Home: React.FC = () => {
  const { data: books, isLoading: loadingBooks } = useQuery({
    queryKey: ["books", 4],
    queryFn: fetchBooks,
  });

  const { data: authors, isLoading: loadingAuthors } = useQuery({
    queryKey: ["authors", 4],
    queryFn: fetchAuthors,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Books Library</h1>
      <div className="space-y-4">
        <div className="flex flex-col justify-between mb-8 gap-4">
          <div className="flex flex-row items-center">
            <h1 className="text-2xl font-bold flex-1">Authors</h1>
            {books?.data?.length ? (
              <Link to="/authors" className="text-blue-500">
                {`View All (${books?.totalCount})`}
              </Link>
            ) : (
              <Link
                to="/authors/create"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Authors
              </Link>
            )}
          </div>
          <div className="flex overflow-x-auto gap-4 scrollbar-hide">
            {authors?.data?.length > 0 ? (
              authors?.data?.map((author: Author) => (
                <AuthorItem key={author.id} author={author} />
              ))
            ) : (
              <div className="text-center text-gray-500 text-lg">
                No Authors Yet
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between mb-8 gap-4">
          <div className="flex flex-row items-center">
            <h1 className="text-2xl font-bold flex-1">Books</h1>
            {books?.data?.length ? (
              <Link to="/books" className="text-blue-500">
                {`View All (${authors?.totalCount})`}
              </Link>
            ) : (
              <Link
                to="/books/create"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Book
              </Link>
            )}
          </div>
          <div className="flex overflow-x-auto gap-4 scrollbar-hide">
            {books?.data?.length > 0 ? (
              books?.data?.map((book: Book) => (
                <BookItem key={book.id} book={book} />
              ))
            ) : (
              <div className="text-center text-gray-500 text-lg">
                No Books Yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

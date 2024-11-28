import React from "react";

import { useQuery } from "@tanstack/react-query";
import AuthorItem from "../components/AuthorItem";
import { Author } from "../components/AuthorForm";
import { Link } from "react-router-dom";
import { Book } from "../components/BookForm";
import BookItem from "../components/BookItem";
import Carousel from "../components/Carousel";

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

const CAROUSEL_CONTENT = 5;

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
    queryKey: ["books", CAROUSEL_CONTENT],
    queryFn: fetchBooks,
  });

  const { data: authors, isLoading: loadingAuthors } = useQuery({
    queryKey: ["authors", CAROUSEL_CONTENT],
    queryFn: fetchAuthors,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Books Library</h1>
      <div className="space-y-4">
        <Carousel
          title="Authors"
          items={authors?.data || []}
          renderItem={(author: Author) => <AuthorItem author={author} />}
          viewAllLink="/authors"
          addLink="/authors/create"
          viewAllLabel="View All"
          isLoading={loadingAuthors}
          noItemsMessage="No Authors Yet"
        />

        <Carousel
          title="Books"
          items={books?.data || []}
          renderItem={(book: Book) => <BookItem book={book} />}
          viewAllLink="/books"
          addLink="/books/create"
          viewAllLabel="View All"
          isLoading={loadingBooks}
          noItemsMessage="No Books Yet"
        />
      </div>
    </div>
  );
};

export default Home;

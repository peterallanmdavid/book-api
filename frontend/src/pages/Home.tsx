import React from "react";

import { useQuery } from "@tanstack/react-query";
import AuthorItem from "../components/AuthorItem";
import { Author } from "../components/AuthorForm";

import { Book } from "../components/BookForm";
import BookItem from "../components/BookItem";
import PreviewList from "../components/PreviewList";

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

const PREVIEW_COUNT = 4;

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
    queryKey: ["books", PREVIEW_COUNT],
    queryFn: fetchBooks,
  });

  const { data: authors, isLoading: loadingAuthors } = useQuery({
    queryKey: ["authors", PREVIEW_COUNT],
    queryFn: fetchAuthors,
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Books Library</h1>
      <div className="space-y-4">
        <PreviewList
          title="Authors"
          items={authors?.data || []}
          renderItem={(author: Author) => <AuthorItem author={author} />}
          viewAllLink="/authors"
          addLink="/authors/create"
          viewAllLabel="View All"
          isLoading={loadingAuthors}
          noItemsMessage="No Authors Yet"
          totalCount={authors?.totalCount || 0}
        />

        <PreviewList
          title="Books"
          items={books?.data || []}
          renderItem={(book: Book) => <BookItem book={book} />}
          viewAllLink="/books"
          addLink="/books/create"
          viewAllLabel="View All"
          isLoading={loadingBooks}
          noItemsMessage="No Books Yet"
          totalCount={books?.totalCount || 0}
        />
      </div>
    </div>
  );
};

export default Home;

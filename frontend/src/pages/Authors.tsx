import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Author } from "../components/AuthorForm";
import AuthorItem from "../components/AuthorItem";

const fetchAuthors = async (): Promise<{
  data: Author[];
  totalCount: number;
}> => {
  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/authors`);
  if (!response.ok) throw new Error("Failed to fetch authors");
  return response.json();
};

const Authors: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  const authors = data?.data;
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
            <AuthorItem key={author.id} author={author} />
          ))
        ) : (
          <>You have not created any books yet, Create one now</>
        )}
      </div>
    </div>
  );
};

export default Authors;

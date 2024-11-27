import React from "react";
import AuthorForm from "../components/AuthorForm";

interface CreateBookProps {}

export const CreateBook: React.FC<CreateBookProps> = () => {
  return (
    <div className="p-8">
      <AuthorForm />
    </div>
  );
};

export default CreateBook;

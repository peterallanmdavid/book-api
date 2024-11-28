import React from "react";
import BookForm from "../components/BookForm";

interface CreateBookProps {}

export const CreateBook: React.FC<CreateBookProps> = () => {
  return (
    <div className="p-8">
      <BookForm />
    </div>
  );
};

export default CreateBook;

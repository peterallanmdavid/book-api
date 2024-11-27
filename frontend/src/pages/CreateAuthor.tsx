import React from "react";
import AuthorForm from "../components/AuthorForm";

interface CreateAuthorProps {}

export const CreateAuthor: React.FC<CreateAuthorProps> = () => {
  return (
    <div className="p-8">
      <AuthorForm />
    </div>
  );
};

export default CreateAuthor;

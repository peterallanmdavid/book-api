import React from "react";
import { Book } from "./BookForm";
import { Card } from "./Card";

interface BookItemProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BookItem: React.FC<BookItemProps> = ({ book, onEdit, onDelete }) => {
  return (
    <Card>
      <h2 className="text-lg font-bold mb-2">{book.title}</h2>
      <p className="text-sm text-gray-500">Author : {book.author?.name}</p>
      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(book);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(book);
          }}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </Card>
  );
};

export default BookItem;

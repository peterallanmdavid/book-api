import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white py-4 shadow">
      <div className=" pl-8 mx-auto flex items-center">
        <Link to="/" className="text-2xl font-bold hover:underline">
          Books Library
        </Link>
      </div>
    </header>
  );
};

export default Header;

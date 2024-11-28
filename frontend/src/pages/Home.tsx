import React from "react";
import Authors from "../components/Authors";
import Books from "../components/Books";

const Home: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-4">
        <Authors />
        <Books />
      </div>
    </div>
  );
};

export default Home;

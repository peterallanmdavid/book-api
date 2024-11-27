import React from "react";

import Books from "./Books";
import Authors from "./Authors";

const Home: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-4">
        <Books />
        <Authors />
      </div>
    </div>
  );
};

export default Home;

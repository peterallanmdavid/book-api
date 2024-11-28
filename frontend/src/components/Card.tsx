import React, { PropsWithChildren } from "react";

interface CardProps {}

export const Card: React.FC<PropsWithChildren<CardProps>> = ({ children }) => {
  return (
    <div className="border rounded shadow p-4 mb-4 bg-white cursor-pointer hover:shadow-md">
      {children}
    </div>
  );
};

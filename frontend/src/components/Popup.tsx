import React, { PropsWithChildren } from "react";

interface PopupProps {
  title: string | undefined;
}

export const Popup: React.FC<PropsWithChildren<PopupProps>> = ({
  children,
  title,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

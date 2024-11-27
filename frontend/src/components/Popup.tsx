import React, { PropsWithChildren } from "react";

interface PopupProps {}

export const Popup: React.FC<PropsWithChildren<PopupProps>> = ({
  children,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">{children}</div>
    </div>
  );
};

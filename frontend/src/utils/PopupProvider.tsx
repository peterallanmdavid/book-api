import React, { createContext, PropsWithChildren, useState } from "react";
import { Popup } from "../components/Popup";

interface PopupProviderProps {}

export type PopupConfig = {
  title?: string;
  content?: JSX.Element;
};

type PopupProviderContextProps = {
  openPopup: (popupConfig: PopupConfig) => void;
  closePopup: () => void;
};

const PopupProviderContext = createContext<PopupProviderContextProps>({
  openPopup: () => null,
  closePopup: () => null,
});

export const PopupProvider: React.FC<PropsWithChildren<PopupProviderProps>> = ({
  children,
}) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupConfig, setPopupConfig] = useState<PopupConfig | undefined>(
    undefined
  );
  const openPopup = (popupConfig: PopupConfig) => {
    setPopupOpen(true);
    setPopupConfig(popupConfig);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setPopupConfig(undefined);
  };

  return (
    <PopupProviderContext.Provider value={{ openPopup, closePopup }}>
      {popupOpen && (
        <Popup title={popupConfig?.title}>{popupConfig?.content}</Popup>
      )}

      {children}
    </PopupProviderContext.Provider>
  );
};

export const usePopup = () => {
  const context = React.useContext(PopupProviderContext);
  if (context === undefined) {
    throw new Error("usePopup must be used within a PopupProvider");
  }
  return context;
};

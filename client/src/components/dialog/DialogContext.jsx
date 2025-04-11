import { createContext, useContext, useState } from "react";

import Dialog from ".";

export const DialogContext = createContext();

export const DialogProvider = ({ children }) => {
  const [dialogContent, setDialogContent] = useState(null);

  const openDialog = (content) => setDialogContent(() => content);
  const closeDialog = () => {
    document.body.style = null;
    setDialogContent(null);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {dialogContent && (
        <Dialog isOpened setIsOpened={closeDialog}>
          {dialogContent}
        </Dialog>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => useContext(DialogContext);

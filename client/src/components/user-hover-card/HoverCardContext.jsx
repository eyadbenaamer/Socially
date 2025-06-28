import { createContext, useContext, useState } from "react";

const HoverCardContext = createContext();

export const useHoverCard = () => useContext(HoverCardContext);

export const HoverCardProvider = ({ children }) => {
  const [activeCardId, setActiveCardId] = useState(null);
  return (
    <HoverCardContext.Provider value={{ activeCardId, setActiveCardId }}>
      {children}
    </HoverCardContext.Provider>
  );
};

import React, { createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const EmbedChoicesContext = createContext();

export const EmbedChoicesProvider = function ({ children }) {
  const [embedChoices, setEmbedChoices] = useLocalStorage("embedChoices", {});
  return <EmbedChoicesContext.Provider value={{ embedChoices, setEmbedChoices }}>{children}</EmbedChoicesContext.Provider>;
};

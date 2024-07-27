/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const DataContext = createContext();

function DataContextProvider({ children }) {
  const [admin, setAdmin] = useState();

  return <DataContext.Provider value={{ admin, setAdmin }}>{children}</DataContext.Provider>;
}

export default DataContextProvider;

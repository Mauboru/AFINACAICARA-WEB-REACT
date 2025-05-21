import { createContext, useContext, useState } from "react";

const TunerContext = createContext();

export const TunerProvider = ({ children }) => {
  const [instrument, setInstrument] = useState("Rabeca");
  const [note, setNote] = useState("A");

  return (
    <TunerContext.Provider value={{ instrument, setInstrument, note, setNote }}>
      {children}
    </TunerContext.Provider>
  );
};

export const useTuner = () => useContext(TunerContext);

import React, { createContext, useContext, useState } from "react"

const defaultState = {
  currentScheme: {},
  selectedLanguage: "",
  conceptSchemeLanguages: [],
  indexPage: false,
}
const Context = createContext(defaultState)

export const ContextProvider = ({ children }) => {
  const [data, setData] = useState(defaultState)
  const updateState = (_data) => setData(_data)

  const contextValues = {
    data,
    updateState,
  }

  return <Context.Provider value={contextValues}>{children}</Context.Provider>
}

export const useSkoHubContext = () => {
  const context = useContext(Context)
  if (context === undefined || context === null) {
    throw new Error(`useSkoHubContext must be called within ContextProvider`)
  }
  return context
}

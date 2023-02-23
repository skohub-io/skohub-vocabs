import { createContext, useContext, useState } from "react"

const defaultState = {
  data: {
    hello: "world",
  },
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
    throw new Error(
      `useSkoHubContext must be called within SimpleContextProvider`
    )
  }
  return context
}

import React, { createContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

export const EmbedChoicesContext = createContext()

export const EmbedChoicesProvider = function ({ children }) {
  const [choices, setChoices] = useLocalStorage('new-work_embedChoices', {})
  return <EmbedChoicesContext.Provider value={{ choices, setChoices }}>{children}</EmbedChoicesContext.Provider>
}

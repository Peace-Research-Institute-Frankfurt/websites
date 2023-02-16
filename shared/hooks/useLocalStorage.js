import { useState, useEffect } from 'react'

function getStorageValue(key, defaultValue) {
  let initial = defaultValue

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key)
    if (saved !== 'undefined') {
      initial = JSON.parse(saved)
    }
  }
  return initial || defaultValue
}

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue)
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

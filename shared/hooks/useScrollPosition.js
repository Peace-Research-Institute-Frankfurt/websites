import { useEffect, useState } from 'react'

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const updateScrollPosition = (e) => {
      setScrollPosition({ x: window.scrollX, y: window.scrollY })
    }
    window.addEventListener('scroll', updateScrollPosition)
    updateScrollPosition()
    return () => {
      window.removeEventListener('scroll', updateScrollPosition)
    }
  }, [])
  return scrollPosition
}
export default useScrollPosition

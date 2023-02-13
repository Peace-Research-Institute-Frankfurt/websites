import { useEffect, useState } from 'react'

const useViewport = () => {
  const [viewport, setViewpot] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const updateViewport = (e) => {
      if (document && document.documentElement) {
        setViewpot({ width: document.documentElement.clientWidth, height: document.documentElement.clientWidth })
      }
    }
    window.addEventListener('resize', updateViewport)
    updateViewport()
    return () => {
      window.removeEventListener('resize', updateViewport)
    }
  }, [])
  return viewport
}
export default useViewport

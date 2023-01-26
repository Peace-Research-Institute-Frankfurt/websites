import React, { useEffect, useRef, useState } from 'react'
import PlayIcon from '../assets/icon-play.svg'
import PauseIcon from '../assets/pause.svg'
import { graphql, useStaticQuery } from 'gatsby'
import * as Styles from './Audio.module.scss'

export default function Audio({ src, type }) {
  const data = useStaticQuery(graphql`
    query {
      files: allFile {
        nodes {
          base
          publicURL
        }
      }
    }
  `)

  // Let's find our image
  let file = null
  data.files.nodes.forEach((f) => {
    if (f.base === src) {
      file = f
    }
  })

  const [playing, setPlaying] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const audioRef = useRef()
  useEffect(() => {
    let updateLoop = window.setInterval(() => {
      setRemaining(audioRef.current.duration - audioRef.current.currentTime)
    }, 500)
    return () => {
      clearInterval(updateLoop)
    }
  }, [])

  function handleAudioError(err) {}

  function formatDuration(d) {
    let minutes = Math.floor(d / 60)
    let seconds = Math.floor(d % 60)
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    // return `${minutes}${d}`;
    return `${minutes}:${seconds}`
  }

  function toggleAudio() {
    if (playing) {
      setPlaying(false)
      audioRef.current.pause()
    } else {
      setPlaying(true)
      audioRef.current.play()
    }
  }
  return (
    <>
      <audio src={file.publicURL} ref={audioRef} onError={handleAudioError}></audio>
      <button className={Styles.container} onClick={toggleAudio}>
        {playing ? <PauseIcon /> : <PlayIcon />}
        {playing ? <>{formatDuration(remaining)}</> : 'Listen'}
      </button>
    </>
  )
}

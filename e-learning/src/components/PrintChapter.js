import React, { useEffect } from 'react'

export default function Chapter({ title, intro, order, children, setChapterList }) {
  useEffect(() => {
    setChapterList((prev) => {
      if (prev.findIndex((el) => el.title === title) === -1) {
        return [...prev, { title: title, order: order }]
      }
      return prev
    })
  }, [setChapterList, title, order])
  return (
    <section className="chapter">
      <header className="chapterHeader">
        <svg viewBox="0 0 100 100" className="chapterHeaderLines" preserveAspectRatio="none">
          <line x1={0} x2={100} y1={0} y2={0}></line>
          <line x1={0} x2={100} y1={100} y2={100}></line>
        </svg>
        <h2 className="chapterTitle" id={`chapter-${order}`}>
          {order}. {title}
        </h2>
        {intro !== 'null' && intro !== 'undefined' && <p className={'chapterIntro'}>{intro}</p>}
      </header>
      <div className="chapterContent">{children}</div>
    </section>
  )
}

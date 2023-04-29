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
        <svg>
          <line x1={0} x2={1000} y1={0} y2={0}></line>
        </svg>
        <h2 className="chapterTitle" id={`chapter-${order}`}>
          {order}. {title}
        </h2>
        {intro !== 'undefined' && <p className={'chapterIntro'}>{intro}</p>}
        <svg>
          <line x1={0} x2={1000} y1={0} y2={0}></line>
        </svg>
      </header>
      <div className="chapterContent">{children}</div>
    </section>
  )
}

import React, { useEffect, useId } from 'react'

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
        <h2 className="chapterTitle" id={`chapter-${order}`}>
          {order}. {title}
        </h2>
        {intro !== 'undefined' && <p className={'chapterIntro'}>{intro}</p>}
      </header>
      <div className="chapterContent">{children}</div>
    </section>
  )
}

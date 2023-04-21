import React from 'react'

export default function Chapter({ title, intro, order, children }) {
  return (
    <section className="chapter">
      <header className="chapterHeader">
        <h2 className="chapterTitle">
          {order}. {title}
        </h2>
        {intro !== 'undefined' && <p className={'chapterIntro'}>{intro}</p>}
      </header>
      <div className="chapterContent">{children}</div>
    </section>
  )
}

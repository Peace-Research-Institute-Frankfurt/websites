import React from 'react';

export default function Footnote({ number }) {
  return (
    <sup id={`fnref-${number}`}>
      <a
        href={`#fn-${number}`}
        className="footnote-ref"
        aria-describedby="footnotes"
      >
        {number}
      </a>
    </sup>
  );
}
import React from 'react';

export default function FootnoteList({ notes }) {
  if (!notes?.length) return null;

  // Funktion, die alle <a>-Tags innerhalb der Note automatisch target & rel hinzufügt
  const processLinks = (note) => {
    return React.Children.map(note, (child) => {
      if (!React.isValidElement(child)) return child;

      // <a>-Tags ergänzen
      if (child.type === 'a') {
        return React.cloneElement(child, {
          target: '_blank',
          rel: 'noopener noreferrer',
        });
      }

      // Rekursiv für verschachtelte Elemente (<>, <i>, etc.)
      if (child.props?.children) {
        return React.cloneElement(child, {
          children: processLinks(child.props.children),
        });
      }

      return child;
    });
  };

  return (
    <div className="footnotes" id="footnotes">
      <ol>
        {notes.map((note, index) => {
          const num = index + 1;
          return (
            <li key={num} id={`fn-${num}`}>
              {processLinks(note)}{' '}
              <a
                href={`#fnref-${num}`}
                className="footnote-backref"
                aria-label="Zurück zur Textstelle"
              >
                ↩
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

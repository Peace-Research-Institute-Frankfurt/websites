import React from 'react';
import { EmbedChoicesProvider } from './src/context/EmbedChoicesContext';

// Wraps the root element with a context provider
export const wrapRootElement = ({ element }) => {
  return <EmbedChoicesProvider>{element}</EmbedChoicesProvider>;
};

// Öffnet alle Links (intern & extern), die kein target haben, in einem neuen Tab
const openAllLinksInNewTab = () => {
  const links = document.querySelectorAll('a');

  links.forEach((link) => {
    const href = link.getAttribute('href');

    if (
      href &&                      // Link hat href
      !link.hasAttribute('target') && // Kein target gesetzt
      !link.dataset.processed      // Noch nicht verarbeitet
    ) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.dataset.processed = 'true'; // Markiere als verarbeitet
    }
  });
};

// Läuft beim ersten Laden der Seite im Browser
export const onClientEntry = () => {
  openAllLinksInNewTab();
};

// Läuft bei jedem internen Routenwechsel (SPA)
export const onRouteUpdate = () => {
  openAllLinksInNewTab();
};
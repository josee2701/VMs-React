import { createContext } from 'react';

export const WSContext = createContext({
  lastEvent: null,
  sendMessage: () => {},
});

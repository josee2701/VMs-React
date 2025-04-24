// src/services/wsContext.jsx
import { createContext } from 'react';

export const WSContext = createContext({
  lastUserEvent: null,
  lastVmEvent:   null,
  sendUserMessage: () => {},
  sendVmMessage:   () => {},
});

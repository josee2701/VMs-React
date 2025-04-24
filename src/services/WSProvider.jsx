// src/services/WSProvider.jsx
import React, { useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { WSContext } from './wsContext';

export function WSProvider({ children }) {
  const [lastEvent, setLastEvent] = useState(null);

  // ← Dos args: primero ruta, luego callback
  const { sendMessage } = useWebSocket(
    '/ws/users',
    event => setLastEvent(event)
  );

  return (
    <WSContext.Provider value={{ lastEvent, sendMessage }}>
      {children}
    </WSContext.Provider>
  );
}

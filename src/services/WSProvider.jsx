// src/services/WSProvider.jsx
import React, { useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { WSContext } from './wsContext';

export function WSProvider({ children }) {
  // estado para cada canal
  const [lastUserEvent, setLastUserEvent] = useState(null);
  const [lastVmEvent,   setLastVmEvent]   = useState(null);

  // abre ws://.../ws/users
  const { sendMessage: sendUserMessage } = useWebSocket(
    '/ws/users',
    event => setLastUserEvent(event)
  );

  // abre ws://.../ws/vms
  const { sendMessage: sendVmMessage } = useWebSocket(
    '/ws/vms',
    event => setLastVmEvent(event)
  );

  return (
    <WSContext.Provider value={{
      lastUserEvent,
      lastVmEvent,
      sendUserMessage,
      sendVmMessage
    }}>
      {children}
    </WSContext.Provider>
  );
}

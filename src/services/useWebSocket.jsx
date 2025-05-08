// // src/services/useWebSocket.jsx
// import { useCallback, useEffect, useRef } from 'react';

// const VITE_WS_URL = "ws://localhost:8000"
// export function useWebSocket(path, onEvent) {
//   const socketRef = useRef(null);

//   const connect = useCallback(() => {
//     const base = VITE_WS_URL;                 // p.e. "ws://localhost:8000"
//     const slash = path.startsWith('/') ? '' : '/';
//     const url = `${base}${slash}${path}`;       // e.g. "ws://localhost:8000/ws/users?token=..."
//     const ws = new WebSocket(url);
//     socketRef.current = ws;

//     ws.onopen = () =>   console.log(`[WS:${path}] conectado`);
//     ws.onmessage = e => {
//       try { onEvent(JSON.parse(e.data)) }
//       catch { console.warn(`[WS:${path}] mensaje no JSON`, e.data) }
//     };
//     ws.onerror = e =>   console.error(`[WS:${path}] error`, e);
//     ws.onclose = () => {
//       console.log(`[WS:${path}] desconectado, reintentando en 5s`);
//       setTimeout(connect, 5000);
//     };
//   }, [path, onEvent]);

//   useEffect(() => {
//     connect();
//     return () => { socketRef.current?.close() };
//   }, [connect]);

//   const sendMessage = useCallback(payload => {
//     const ws = socketRef.current;
//     if (ws?.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify(payload));
//     } else {
//       console.warn(`[WS:${path}] no abierta para enviar`);
//     }
//   }, [path]);

//   return { sendMessage };
// }

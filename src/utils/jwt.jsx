// src/utils/jwt.js
export function parseJwt (token) {
    try {
      const base64Payload = token.split('.')[1];
      const jsonPayload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error al decodificar JWT:', e);
      return {};
    }
  }
  
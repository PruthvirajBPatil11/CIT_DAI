// QR Session Management - Handles linking desktop with mobile uploads
// Uses localStorage to share data between desktop QR generator and mobile uploader

export function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getQRCodeURL(sessionId) {
  const baseURL = window.location.origin;
  return `${baseURL}/mobile-upload/${sessionId}`;
}

export function storeSessionData(sessionId, data) {
  const sessions = JSON.parse(localStorage.getItem('qr_sessions') || '{}');
  sessions[sessionId] = {
    ...data,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
  localStorage.setItem('qr_sessions', JSON.stringify(sessions));
  // Broadcast to other tabs
  broadcastSessionUpdate(sessionId, sessions[sessionId]);
}

export function getSessionData(sessionId) {
  const sessions = JSON.parse(localStorage.getItem('qr_sessions') || '{}');
  return sessions[sessionId];
}

export function saveSessionResults(sessionId, results) {
  const sessions = JSON.parse(localStorage.getItem('qr_sessions') || '{}');
  if (sessions[sessionId]) {
    sessions[sessionId].results = results;
    sessions[sessionId].resultsAt = Date.now();
    localStorage.setItem('qr_sessions', JSON.stringify(sessions));
    broadcastSessionUpdate(sessionId, sessions[sessionId]);
  }
}

export function getSessionResults(sessionId) {
  const sessions = JSON.parse(localStorage.getItem('qr_sessions') || '{}');
  return sessions[sessionId]?.results || null;
}

export function broadcastSessionUpdate(sessionId, data) {
  // Use BroadcastChannel if available for real-time updates
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('qr_session_updates');
    channel.postMessage({
      type: 'SESSION_UPDATE',
      sessionId,
      data
    });
    channel.close();
  }
}

export function listenToSessionUpdates(sessionId, callback) {
  // Listen for real-time updates using BroadcastChannel
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('qr_session_updates');
    const listener = (event) => {
      if (event.data.type === 'SESSION_UPDATE' && event.data.sessionId === sessionId) {
        callback(event.data.data);
      }
    };
    channel.addEventListener('message', listener);
    return () => {
      channel.removeEventListener('message', listener);
      channel.close();
    };
  }
  
  // Fallback to polling if BroadcastChannel not available
  const interval = setInterval(() => {
    const data = getSessionData(sessionId);
    if (data) {
      callback(data);
    }
  }, 1000);
  
  return () => clearInterval(interval);
}

export function cleanupExpiredSessions() {
  const sessions = JSON.parse(localStorage.getItem('qr_sessions') || '{}');
  const now = Date.now();
  const cleaned = Object.entries(sessions).reduce((acc, [key, session]) => {
    if (session.expiresAt > now) {
      acc[key] = session;
    }
    return acc;
  }, {});
  localStorage.setItem('qr_sessions', JSON.stringify(cleaned));
}

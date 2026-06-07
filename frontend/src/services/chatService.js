import api from './api'

export const chatService = {
  /**
   * Send a chat message to the AI
   * @param {string} message
   * @param {string|null} sessionId
   * @param {string|null} userName
   * @returns {Promise<{reply: string, session_id: string, conversation_id: number}>}
   */
  sendMessage: async (message, sessionId = null, userName = null) => {
    const response = await api.post('/chat', {
      message,
      session_id: sessionId,
      user_name: userName,
    })
    return response.data
  },
}

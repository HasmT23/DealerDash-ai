export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }
  
  export interface ChatbotResponse {
    message: string;
    suggestedActions?: string[];
  }
  
  export interface IChatbotService {
    generateResponse(
      messages: ChatMessage[],
      context?: Record<string, any>
    ): Promise<ChatbotResponse>;
  } 
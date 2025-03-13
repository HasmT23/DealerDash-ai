import { IChatbotService, ChatMessage, ChatbotResponse } from '@/core/interfaces/IChatbotService';
import OpenAI from 'openai';

export class OpenAIChatbotService implements IChatbotService {
  private openai: OpenAI;
  private model: string;
  private systemPrompt: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenAI API key is not set. Chatbot service will not work properly.');
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey || 'dummy-key',
    });
    
    this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
    
    this.systemPrompt = `
      You are an automotive dealership assistant named DealerDash AI. 
      Your role is to help customers with questions about vehicles, financing, trade-ins, and the car buying process.
      
      Be friendly, helpful, and concise in your responses. If you don't know something, say so rather than making up information.
      
      When discussing financing, explain terms clearly and avoid making specific promises about rates or approvals.
      
      For trade-in values, explain that estimates are based on current market data and the actual offer may vary after inspection.
      
      Always suggest next steps or actions the customer can take.
    `;
  }

  async generateResponse(
    messages: ChatMessage[],
    context?: Record<string, any>
  ): Promise<ChatbotResponse> {
    try {
      // Add system prompt if not already present
      if (!messages.some(msg => msg.role === 'system')) {
        messages = [
          { role: 'system', content: this.systemPrompt },
          ...messages
        ];
      }
      
      // Add context information if provided
      if (context) {
        const contextPrompt = this.buildContextPrompt(context);
        messages = [
          { role: 'system', content: this.systemPrompt + '\n\n' + contextPrompt },
          ...messages.filter(msg => msg.role !== 'system')
        ];
      }
      
      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      
      const message = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      // Extract suggested actions if any (format: [ACTION: action1, action2, ...])
      const suggestedActions = this.extractSuggestedActions(message);
      
      return {
        message: this.cleanMessage(message),
        suggestedActions
      };
    } catch (error) {
      console.error('Error generating chatbot response:', error);
      return {
        message: 'Sorry, I encountered an error while processing your request. Please try again later.'
      };
    }
  }
  
  private buildContextPrompt(context: Record<string, any>): string {
    let contextPrompt = 'Here is some additional context that may be helpful:\n\n';
    
    if (context.dealership) {
      contextPrompt += `Dealership: ${context.dealership.name}\n`;
      contextPrompt += `Location: ${context.dealership.city}, ${context.dealership.state}\n\n`;
    }
    
    if (context.vehicle) {
      contextPrompt += `Customer is interested in: ${context.vehicle.year} ${context.vehicle.make} ${context.vehicle.model}\n`;
      contextPrompt += `Price: $${context.vehicle.price?.toLocaleString()}\n\n`;
    }
    
    if (context.financing) {
      contextPrompt += `Financing details:\n`;
      contextPrompt += `Loan amount: $${context.financing.loanAmount?.toLocaleString()}\n`;
      contextPrompt += `Term: ${context.financing.term} months\n`;
      contextPrompt += `APR: ${context.financing.apr}%\n\n`;
    }
    
    if (context.tradeIn) {
      contextPrompt += `Trade-in details:\n`;
      contextPrompt += `Vehicle: ${context.tradeIn.year} ${context.tradeIn.make} ${context.tradeIn.model}\n`;
      contextPrompt += `Estimated value: $${context.tradeIn.value?.toLocaleString()}\n\n`;
    }
    
    return contextPrompt;
  }
  
  private extractSuggestedActions(message: string): string[] | undefined {
    const actionMatch = message.match(/\[ACTIONS?:(.*?)\]/i);
    if (actionMatch && actionMatch[1]) {
      return actionMatch[1].split(',').map(action => action.trim());
    }
    return undefined;
  }
  
  private cleanMessage(message: string): string {
    // Remove the [ACTION: ...] tag from the message
    return message.replace(/\[ACTIONS?:.*?\]/i, '').trim();
  }
}
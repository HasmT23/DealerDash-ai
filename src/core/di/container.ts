import { IDatabaseService } from '@/core/interfaces/IDatabaseService';
import { FirebaseDatabaseService } from '@/infrastructure/database/FirebaseDatabaseService';
import { IValuationService } from '@/core/interfaces/IValuationService';
import { MarketCheckValuationService } from '@/infrastructure/valuation/MarketCheckValuationService';
import { IFinancingService } from '@/core/interfaces/IFinancingService';
import { CustomFinancingService } from '@/infrastructure/financing/CustomFinancingService';
import { IChatbotService } from '@/core/interfaces/IChatbotService';
import { OpenAIChatbotService } from '@/infrastructure/chatbot/OpenAIChatbotService';

// Singleton instance
let databaseService: IDatabaseService;

// Singleton instances
let valuationService: IValuationService;

// Singleton instances
let chatbotService: IChatbotService;

// Get database service instance
export function getDatabaseService(): IDatabaseService {
  if (!databaseService) {
    databaseService = new FirebaseDatabaseService();
  }
  return databaseService;
}

// Get valuation service instance
export function getValuationService(): IValuationService {
  if (!valuationService) {
    valuationService = new MarketCheckValuationService();
  }
  return valuationService;
}

// Add this function
export function getAuthService(): any {
  // Placeholder until you implement auth service
  return {};
}

// Get chatbot service instance
export function getChatbotService(): IChatbotService {
  if (!chatbotService) {
    chatbotService = new OpenAIChatbotService();
  }
  return chatbotService;
}

// Update the services export
export const services = {
  getDatabaseService,
  getAuthService,
  getValuationService,
  getChatbotService
};

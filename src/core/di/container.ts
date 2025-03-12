import { IDatabaseService } from '@/core/interfaces/IDatabaseService';
import { FirebaseDatabaseService } from '@/infrastructure/database/FirebaseDatabaseService';

// Singleton instance
let databaseService: IDatabaseService;

// Get database service instance
export function getDatabaseService(): IDatabaseService {
  if (!databaseService) {
    databaseService = new FirebaseDatabaseService();
  }
  return databaseService;
}

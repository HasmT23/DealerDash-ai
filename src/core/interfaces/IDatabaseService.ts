export interface IDatabaseService {
    create(collection: string, document: object): Promise<string>;
    read(collection: string, id: string): Promise<object | null>;
    update(collection: string, id: string, document: object): Promise<boolean>;
    delete(collection: string, id: string): Promise<boolean>;
    query(collection: string, queryParams: Record<string, any>): Promise<object[]>;
  } 
  
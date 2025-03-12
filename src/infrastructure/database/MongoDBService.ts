import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { IDatabaseService } from '@/core/interfaces/IDatabaseService';

export class MongoDBService implements IDatabaseService {
  private client: MongoClient;
  private db: Db | null = null;
  private readonly uri: string;
  private readonly dbName: string;

  constructor() {
    this.uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    this.dbName = process.env.MONGODB_DB_NAME || 'dealerdash';
    this.client = new MongoClient(this.uri);
  }

  private async connect(): Promise<Db> {
    if (!this.db) {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
    }
    return this.db;
  }

  private async getCollection(collectionName: string): Promise<Collection> {
    const db = await this.connect();
    return db.collection(collectionName);
  }

  async create(collectionName: string, document: object): Promise<string> {
    try {
      const collection = await this.getCollection(collectionName);
      const result = await collection.insertOne({
        ...document,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return result.insertedId.toString();
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw new Error(`Failed to create document in ${collectionName}`);
    }
  }

  async read(collectionName: string, id: string): Promise<object | null> {
    try {
      const collection = await this.getCollection(collectionName);
      const result = await collection.findOne({ _id: new ObjectId(id) });
      
      if (result) {
        return { id: result._id.toString(), ...result };
      }
      return null;
    } catch (error) {
      console.error(`Error reading document ${id} from ${collectionName}:`, error);
      throw new Error(`Failed to read document ${id} from ${collectionName}`);
    }
  }

  async update(collectionName: string, id: string, document: object): Promise<boolean> {
    try {
      const collection = await this.getCollection(collectionName);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: {
            ...document,
            updatedAt: new Date()
          } 
        }
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw new Error(`Failed to update document ${id} in ${collectionName}`);
    }
  }

  async delete(collectionName: string, id: string): Promise<boolean> {
    try {
      const collection = await this.getCollection(collectionName);
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      throw new Error(`Failed to delete document ${id} from ${collectionName}`);
    }
  }

  async query(collectionName: string, queryParams: Record<string, any>): Promise<object[]> {
    try {
      const collection = await this.getCollection(collectionName);
      const cursor = collection.find(queryParams);
      const results = await cursor.toArray();
      return results.map(doc => ({
        id: doc._id.toString(),
        ...doc
      }));
    } catch (error) {
      console.error(`Error querying collection ${collectionName}:`, error);
      throw new Error(`Failed to query collection ${collectionName}`);
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.db = null;
    }
  }
}
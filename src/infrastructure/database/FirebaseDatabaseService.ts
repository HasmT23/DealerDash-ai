import { db } from '@/infrastructure/firebase/config';
import { 
  collection, doc, getDoc, setDoc, updateDoc, deleteDoc, 
  query as firestoreQuery, where, getDocs, CollectionReference,
  DocumentData 
} from 'firebase/firestore';
import { IDatabaseService } from '@/core/interfaces/IDatabaseService';

export class FirebaseDatabaseService implements IDatabaseService {
  private getCollectionRef(collectionName: string): CollectionReference<DocumentData> {
    return collection(db, collectionName);
  }

  async create(collectionName: string, document: object): Promise<string> {
    try {
      const collectionRef = this.getCollectionRef(collectionName);
      const docRef = doc(collectionRef);
      await setDoc(docRef, {
        ...document,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw new Error(`Failed to create document in ${collectionName}`);
    }
  }

  async read(collectionName: string, id: string): Promise<object | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error reading document ${id} from ${collectionName}:`, error);
      throw new Error(`Failed to read document ${id} from ${collectionName}`);
    }
  }

  async update(collectionName: string, id: string, document: object): Promise<boolean> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...document,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw new Error(`Failed to update document ${id} in ${collectionName}`);
    }
  }

  async delete(collectionName: string, id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      throw new Error(`Failed to delete document ${id} from ${collectionName}`);
    }
  }

  async query(collectionName: string, queryParams: Record<string, any>): Promise<object[]> {
    try {
      const collectionRef = this.getCollectionRef(collectionName);
      let queryRef = firestoreQuery(collectionRef);

      if (queryParams) {
        Object.entries(queryParams).forEach(([field, value]) => {
          queryRef = firestoreQuery(queryRef, where(field, '==', value));
        });
      }
      
      const querySnapshot = await getDocs(queryRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error querying collection ${collectionName}:`, error);
      throw new Error(`Failed to query collection ${collectionName}`);
    }
  }
}
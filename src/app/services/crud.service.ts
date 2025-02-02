import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, limit, where } from '@angular/fire/firestore';
import { inject } from '@angular/core';  // Import inject

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private firestore: Firestore = inject(Firestore); // Use inject to inject the Firestore service

  constructor() {}

  // Correctly using Firestore's modular API to fetch data from a collection
  async getItems(collectionName: string, limitCount: number = 100, type?: string) {
    try {

      let itemsQuery;

      if (type) {
        itemsQuery = query(
          collection(this.firestore, collectionName),
          where("type", "==", type),  // Add the where condition
          limit(limitCount)
        );
      } else {
        // If no typeValue is provided, just apply the limit
        itemsQuery = query(
          collection(this.firestore, collectionName),  // Reference to the collection
          limit(limitCount)  // Limit the number of documents
        );
      }


      // Get documents from Firestore
      const querySnapshot = await getDocs(itemsQuery);
      const items: any[] = [];

      // Collect data from each document
      querySnapshot.forEach((doc) => {
        items.push(
          doc.data()); // Collecting the data from each document
      });

      return items;
    } catch (error) {
      console.error('Error getting documents: ', error);
      throw error;
    }
  }

  async addItem(collectionName: string, item: any): Promise<any> {
    try {
      // Create a reference to the collection in Firestore
      const itemsCollection = collection(this.firestore, collectionName); // Pass the collection name (a string)
      const docRef = await addDoc(itemsCollection, item); // Add the document to the collection
      return docRef;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  // Update (Atualizar um item existente)
  async updateItem(collection: any, id: string, data: any): Promise<void> {
    try {
      const itemDoc = doc(this.firestore, collection, id);
      await updateDoc(itemDoc, data);
    } catch (error) {
      console.error("Error updating document: ", error);
      throw error;
    }
  }

  // Delete (Deletar um item)
  async deleteItem(collection: any, id: string): Promise<void> {
    try {
      const itemDoc = doc(this.firestore, collection, id);
      await deleteDoc(itemDoc);
    } catch (error) {
      console.error("Error deleting document: ", error);
      throw error;
    }
  }
}

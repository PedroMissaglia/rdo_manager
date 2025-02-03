import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Firestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, limit, where, setDoc, getDoc, arrayUnion } from '@angular/fire/firestore';
import { inject } from '@angular/core';  // Import inject

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private firestore: Firestore = inject(Firestore); // Use inject to inject the Firestore service

  constructor() {}

  // Correctly using Firestore's modular API to fetch data from a collection
  async getItems(collectionName: string, limitCount: number = 100, conditionName?: string, conditionValue?: string) {
    try {

      let itemsQuery;

      if (conditionName && conditionValue) {
        itemsQuery = query(
          collection(this.firestore, collectionName),
          where(conditionName, "==", conditionValue),  // Add the where condition
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

  // // Função para obter o log diário do usuário corrente
  // getCurrentDailyLog(userId: string): Observable<any> {
  //   const today = new Date();
  //   const todayString = today.toISOString().split('T')[0];  // Converte a data para 'YYYY-MM-DD'

  //   let itemsQuery = query(
  //     collection(this.firestore, 'rdo'),
  //     where("type", "==", type),  // Add the where condition
  //     limit(limitCount)
  //   );

  //   return this.firestore.collection('rdo', ref =>
  //     ref.where('userId', '==', userId) // Filtro para o usuário
  //        .where('date', '==', todayString) // Filtro para a data de hoje
  //   ).valueChanges().pipe(
  //     map(logs => logs.length > 0 ? logs[0] : null)  // Se encontrado, retorna o log, senão retorna null
  //   );
  // }

  async addItem(collectionName: string, item: any): Promise<any> {
    try {
      // Create a reference to the collection in Firestore
      const itemsCollection = collection(this.firestore, collectionName); // Pass the collection name (a string)
      const docRef = await addDoc(itemsCollection, item); // Add the document to the collection
      return { id: docRef.id, ...item };
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  // Update (Atualizar um item existente)
  async updateItem(collection: any, id: string, data: any): Promise<any> {
    try {
      const itemDoc = doc(this.firestore, collection, id);
      await updateDoc(itemDoc, data);
      return { ...data };
    } catch (error) {
      console.error("Error updating document: ", error);
      throw error;
    }
  }

  async updateItemWithPhoto(collection: string, id: string, data: any, newPhoto: any): Promise<any> {
    try {
      const itemDoc = doc(this.firestore, collection, id);

      // Atualiza os dados principais do documento
      await updateDoc(itemDoc, data);

      // Agora, adiciona o novo objeto (foto) no array 'fotos' usando arrayUnion()
      await updateDoc(itemDoc, {
        fotos: arrayUnion(newPhoto)
      });

      // Recupera o documento atualizado para devolver os dados mais recentes
      const updatedDoc = await getDoc(itemDoc);

      if (updatedDoc.exists()) {
        return updatedDoc.data(); // Retorna os dados completos após o update
      } else {
        throw new Error("Documento não encontrado");
      }

    } catch (error) {
      console.error("Erro ao atualizar documento: ", error);
      throw error;  // Relança o erro após o log
    }
  }

  // Update (Atualizar um item existente)
async updateItemWithFoto(collection: string, id: string, data: any): Promise<any> {
  try {
    const itemDoc = doc(this.firestore, collection, id);

    // Update the document with the new data
    await updateDoc(itemDoc, data);

    // Retrieve the updated document to return the full document after the update
    const updatedDoc = await getDoc(itemDoc);

    if (updatedDoc.exists()) {
      return updatedDoc.data(); // Return the updated data (or the full document data)
    } else {
      throw new Error("Document not found");
    }

  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;  // Rethrow error after logging
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

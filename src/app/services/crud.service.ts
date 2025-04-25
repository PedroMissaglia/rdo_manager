import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where, orderBy, startAt, endAt, limit, doc, setDoc, updateDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  // Get reports by client ID
  async getReportsByClient(clientId: string, limitCount: number = 100): Promise<any[]> {
    try {
      const q = query(
        collection(this.firestore, 'dailyReports'),
        where('cliente', '==', clientId),
        orderBy('dataInicio', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting reports by client: ', error);
      throw error;
    }
  }

  // Get reports by status (finished/started)
  async getReportsByStatus(status: 'finished' | 'started', limitCount: number = 100): Promise<any[]> {
    try {
      const q = query(
        collection(this.firestore, 'dailyReports'),
        where('status', '==', status),
        orderBy('dataInicio', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting reports by status: ', error);
      throw error;
    }
  }

  // Get reports by date range
  async getReportsByDateRange(startDate: Date, endDate: Date, limitCount: number = 100): Promise<any[]> {
    try {
      const q = query(
        collection(this.firestore, 'dailyReports'),
        where('dataInicio', '>=', startDate),
        where('dataInicio', '<=', endDate),
        orderBy('dataInicio', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting reports by date range: ', error);
      throw error;
    }
  }

  // Get reports by plate (placa)
  async getReportsByPlate(plate: string, limitCount: number = 100): Promise<any[]> {
    try {
      const q = query(
        collection(this.firestore, 'dailyReport'),
        where('placa', '==', plate),
        orderBy('dataInicio', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting reports by plate: ', error);
      throw error;
    }
  }

  // Get reports by responsible person
  async getReportsByResponsible(responsavel: string, limitCount: number = 100): Promise<any[]> {
    try {
      const q = query(
        collection(this.firestore, 'dailyReports'),
        where('responsavel', '==', responsavel),
        orderBy('dataInicio', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting reports by responsible: ', error);
      throw error;
    }
  }

  // Get reports with photos (where foto array is not empty)
  async getReportsWithPhotos(limitCount: number = 100): Promise<any[]> {
    try {
      // Note: Firestore doesn't support direct array length queries,
      // so we need to get all and filter client-side for this case
      const q = query(
        collection(this.firestore, 'dailyReports'),
        orderBy('dataInicio', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((report: any)  => report['foto'] && report['foto'].length > 0);
    } catch (error) {
      console.error('Error getting reports with photos: ', error);
      throw error;
    }
  }

  // Get reports by operator (user)
  async getReportsByOperator(userId: string, limitCount: number = 100): Promise<any[]> {
    try {
      const q = query(
        collection(this.firestore, 'dailyReports'),
        where('user', '==', userId),
        orderBy('dataInicio', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting reports by operator: ', error);
      throw error;
    }
  }

  // Get reports with negative info
  async getNegativeReports(limitCount: number = 100): Promise<any[]> {
    try {
      const q = query(
        collection(this.firestore, 'dailyReports'),
        where('info', '==', 'negative'),
        orderBy('dataInicio', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting negative reports: ', error);
      throw error;
    }
  }

  // Get reports with specific justification text (partial match)
  async searchReportsByJustification(searchText: string, limitCount: number = 10): Promise<any[]> {
    try {
      // Convert to lowercase for case-insensitive search
      const term = searchText.toLowerCase();
      const startTerm = term;
      const endTerm = term + '\uf8ff';

      const q = query(
        collection(this.firestore, 'dailyReports'),
        orderBy('justificativa'),
        startAt(startTerm),
        endAt(endTerm),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error searching reports by justification: ', error);
      throw error;
    }
  }

  // Get reports with combined filters
  async getReportsWithCombinedFilters(filters: {
    clientId?: string;
    status?: 'finished' | 'started';
    startDate?: Date;
    endDate?: Date;
    plate?: string;
    responsible?: string;
    userId?: string;
    info?: string;
  }, limitCount: number = 100): Promise<any[]> {
    try {
      const queryConstraints = [];

      // Add filters based on provided parameters
      if (filters.clientId) {
        queryConstraints.push(where('cliente', '==', filters.clientId));
      }
      if (filters.status) {
        queryConstraints.push(where('status', '==', filters.status));
      }
      if (filters.startDate && filters.endDate) {
        queryConstraints.push(where('dataInicio', '>=', filters.startDate));
        queryConstraints.push(where('dataInicio', '<=', filters.endDate));
      }
      if (filters.plate) {
        queryConstraints.push(where('placa', '==', filters.plate));
      }
      if (filters.responsible) {
        queryConstraints.push(where('responsavel', '==', filters.responsible));
      }
      if (filters.userId) {
        queryConstraints.push(where('user', '==', filters.userId));
      }
      if (filters.info) {
        queryConstraints.push(where('info', '==', filters.info));
      }

      // Always order by date
      queryConstraints.push(orderBy('dataInicio', 'desc'));
      queryConstraints.push(limit(limitCount));

      const q = query(collection(this.firestore, 'dailyReports'), ...queryConstraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting reports with combined filters: ', error);
      throw error;
    }
  }

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

  async addItem(collectionName: string, item: any, customId: string): Promise<any> {
    try {
      // Create a reference to the collection in Firestore
      const itemsCollection = collection(this.firestore, collectionName); // Pass the collection name (a string)
      const docRef = doc(itemsCollection, customId); // Add the document to the collection

      await setDoc(docRef, item);
      return { id: customId, ...item };
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

      // // Agora, adiciona o novo objeto (foto) no array 'fotos' usando arrayUnion()
      // await updateDoc(itemDoc, {
      //   fotos: arrayUnion(newPhoto)
      // });

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

  generateFirebaseId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
    return id;
  }
}

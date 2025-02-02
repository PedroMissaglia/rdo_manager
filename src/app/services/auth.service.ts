import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Import for Firebase Authentication
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Import for Firestore
import { catchError, map, Observable, of } from 'rxjs';
import { from } from 'rxjs'; // For converting promises to observables
import { IUser } from '../interfaces/user.interface';
import {
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private firestore = inject(Firestore);

  // Login method: Check if the email and password match a user in Firestore
  async login(login: string, password: string): Promise<IUser | null> {
    try {
      // Construct the query
      const usersQuery = query(
        collection(this.firestore, 'user'),
        where('login', '==', login),
        where('password', '==', password) // Ensure to hash password in production
      );

      // Fetch documents from Firestore using getDocs
      const querySnapshot = await getDocs(usersQuery);

      // If any documents are returned, return the first one
      if (querySnapshot.empty) {
        return null; // No matching user found
      }

      // Extract the data of the first document
      const userDoc = querySnapshot.docs[0];
      return userDoc.data() as IUser; // Return user data
    } catch (error) {
      console.error('Error logging in: ', error);
      return null;
    }
  }
}

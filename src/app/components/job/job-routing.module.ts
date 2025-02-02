import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { NewComponent } from './new/new.component';
import { EditComponent } from './edit/edit.component';
import { JobComponent } from './job.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore/lite';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTMXi_vhTNEnUgnPpHwZZLVMEfBtXyh7Y",
  authDomain: "rdo-manager.firebaseapp.com",
  databaseURL: "https://rdo-manager-default-rtdb.firebaseio.com",
  projectId: "rdo-manager",
  storageBucket: "rdo-manager.firebasestorage.app",
  messagingSenderId: "774211567998",
  appId: "1:774211567998:web:d7eb2a66ee2c24c4bdb32f"
};

const jobRoutes: Routes = [
  {
    path: '',
    component: JobComponent,
  },
  {
    path: 'job/:id',
    component: DetailComponent,
  },
  {
    path: 'job/create',
    component: NewComponent,
  },
  {
    path: 'job/edit/:id',
    component: EditComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(jobRoutes)],
  exports: [RouterModule],
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),  // Initialize Firebase
    provideFirestore(() => getFirestore()),
  ]
})
export class JobRoutingModule {}

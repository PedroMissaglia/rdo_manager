import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoModule } from '@po-ui/ng-components';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { DetailComponent } from './detail/detail.component';
import { JobRoutingModule } from './job-routing.module';
import { JobComponent } from './job.component';
import { EditComponent } from './edit/edit.component';
import { NewComponent } from './new/new.component';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDTMXi_vhTNEnUgnPpHwZZLVMEfBtXyh7Y',
  authDomain: 'rdo-manager.firebaseapp.com',
  databaseURL: 'https://rdo-manager-default-rtdb.firebaseio.com',
  projectId: 'rdo-manager',
  storageBucket: 'rdo-manager.firebasestorage.app',
  messagingSenderId: '774211567998',
  appId: '1:774211567998:web:d7eb2a66ee2c24c4bdb32f',
};
@NgModule({
  declarations: [
    JobComponent,
    DetailComponent,
    EditComponent,
    NewComponent
  ],
  imports: [
    CommonModule,
    PoModule,
    JobRoutingModule,
    AngularFirestoreModule.enablePersistence(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [JobComponent, DetailComponent, EditComponent, NewComponent],
  providers: [
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)), // Initialize Firebase
  ],
})
export class JobModule {}

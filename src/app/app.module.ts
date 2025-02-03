import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { PoImageModule, PoModule } from '@po-ui/ng-components';
import { PoPageLoginModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideFirestore, getFirestore, Firestore } from '@angular/fire/firestore'; // Modular API
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { HomeComponent } from './components/home/home.component';
import { DetailDailyReportComponent } from './components/home/detail-daily-report/detail-daily-report.component';
import { LoginComponent } from './components/login/login.component';
import { ColaboradorModule } from './components/colaborador/colaborador.module';
import { JobModule } from './components/job/job.module';
import { DailyLogComponent } from './components/daily-log/daily-log.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';  // Import WebcamModule
import { CameraComponent } from './components/camera/camera.component';

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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailDailyReportComponent,
    LoginComponent,
    DailyLogComponent,
    CameraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ColaboradorModule,
    BrowserAnimationsModule,
    PoModule,
    JobModule,
    FormsModule,
    ReactiveFormsModule,
    WebcamModule,  // Include WebcamModule in imports
    PoPageLoginModule,
    RouterModule,
    PoImageModule,
    PoTemplatesModule,
    AngularFireDatabaseModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideFirestore(() => getFirestore()), // Move to providers
    provideFirebaseApp(() => initializeApp(firebaseConfig)),  // Initialize Firebase
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

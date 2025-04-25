import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { PoImageModule, PoModule } from '@po-ui/ng-components';
import { PoPageLoginModule, PoTemplatesModule } from '@po-ui/ng-templates';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DetailDailyReportComponent } from './components/home/detail-daily-report/detail-daily-report.component';
import { LoginComponent } from './components/login/login.component';
import { ColaboradorModule } from './components/colaborador/colaborador.module';
import { JobModule } from './components/job/job.module';
import { DailyLogComponent } from './components/daily-log/daily-log.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebcamModule } from 'ngx-webcam';
import { CameraComponent } from './components/camera/camera.component';
import { EditDailyReportComponent } from './components/home/edit-daily-report/edit-daily-report.component';
import { ClientModule } from './components/client/client.module';
import { DecimalPipe } from '@angular/common';

// Firebase Modular Imports (v9+)
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { MapComponent } from './components/home/detail-daily-report/map/map.component';

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
    MapComponent,
    EditDailyReportComponent,
    CameraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ColaboradorModule,
    ClientModule,
    BrowserAnimationsModule,
    PoModule,
    JobModule,
    FormsModule,
    ReactiveFormsModule,
    WebcamModule,
    PoPageLoginModule,
    RouterModule,
    PoImageModule,
    PoTemplatesModule,
  ],
  providers: [
    DecimalPipe,
    provideHttpClient(withInterceptorsFromDi()),
    // Firebase Modular Configuration
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

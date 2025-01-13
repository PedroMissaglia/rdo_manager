import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PoModule } from '@po-ui/ng-components';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { PoPageLoginModule } from '@po-ui/ng-templates';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { JobModule } from './job/job.module';
import { ColaboradorModule } from './colaborador/colaborador.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    AppRoutingModule,
    RouterModule,
    JobModule,
    ColaboradorModule,
    BrowserAnimationsModule,
    PoModule,
    PoPageLoginModule,
    RouterModule.forRoot([]),
    PoTemplatesModule],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

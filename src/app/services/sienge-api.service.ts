import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiengeApiService {
  // private baseUrl = environment.siengeApiUrl;
  private baseUrl = '/sienge-api';


  //[ Base URL: api.sienge.com.br/{subdominio-do-cliente}/public/api/v1 ]
  constructor(private http: HttpClient) {}

    /**
   * Autenticação via Basic Auth (conforme documentação do Sienge)
   * Credenciais são codificadas em base64 (usuário:senha)
   */
  private getBasicAuthHeader(): HttpHeaders {
    const credentials = `${environment.siengeClientId}:${environment.siengeClientSecret}`;
    const encodedCredentials = btoa(credentials); // Codifica em base64

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${encodedCredentials}`
    });
  }

    /**
   * Método genérico para chamadas autenticadas
   */
  private authenticatedRequest<T>(method: string, endpoint: string, data?: any): Observable<T> {

    const url = `${this.baseUrl}${endpoint}`;
      const headers = this.getBasicAuthHeader();

    return this.http.request<T>(method, url, {
      headers,
      body: data
    });
  }

  // Exemplo: Criar RDO
  createDailyReport(payload: any): Observable<any> {
    return this.authenticatedRequest('POST', '/construction-daily-reports', payload);
  }

  // Exemplo: Listar obras
  getConstructions(): Observable<any> {
    return this.authenticatedRequest('GET', '/construction-daily-report');
  }
}

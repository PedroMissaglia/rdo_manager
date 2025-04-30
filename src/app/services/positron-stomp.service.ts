import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { XMLParser } from 'fast-xml-parser';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PositronService {
  private readonly url = 'http://mensageria-integracao.positronrt.com.br:12353'; // Substitua pela URL real
  private readonly username = 'swl'; // Substitua com credenciais reais
  private readonly password = '2AEPnX3KBQhX';

  constructor(private readonly http: HttpClient) {}

  async getServicePackageByPlate(plate: string): Promise<string | null> {
    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pos="http://pst.com.br/position.xsd">
        <soapenv:Header/>
        <soapenv:Body>
          <pos:getServicePackageByPlate>
            <request>
              <username>${this.username}</username>
              <password>${this.password}</password>
              <licenseplate>${plate}</licenseplate>
            </request>
          </pos:getServicePackageByPlate>
        </soapenv:Body>
      </soapenv:Envelope>
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml;charset=UTF-8',
      SOAPAction: "http://pst.com.br/position.xsd/getServicePackageByPlate"
    });

    try {
      const response = await firstValueFrom(
        this.http.post(this.url, soapBody, { headers, responseType: 'text' })
      );

      const parser = new XMLParser({ ignoreAttributes: false });
      const json = parser.parse(response);

      const description = json['SOAP-ENV:Envelope']
        ?.['SOAP-ENV:Body']
        ?.['pst:ServicePackageResponse']
        ?.description;

      return description || null;
    } catch (error) {
      console.error('Erro ao consultar pacote de serviço:', error);
      return null;
    }
  }
}

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
      <soapenv:Envelope
	xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
	xmlns:pos="http://pst.com.br/position.xsd">
	<soapenv:Header/>
	<soapenv:Body>
		<pos:getOccurrences>
			<request>
				<username>swl</username>
				<password>2AEPnX3KBQhX</password>
				<queuename>fila_swl</queuename>
			</request>
		</pos:getOccurrences>
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

      const vehicles = json['SOAP-ENV:Envelope']['SOAP-ENV:Body']['pst:OccurrenceResponse']["occurrences"];

      return vehicles ;
    } catch (error) {
      console.error('Erro ao consultar pacote de serviço:', error);
      return null;
    }
  }

  async getLastPositions(plate: string, limit: number = 10) {
    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
        <soapenv:Header/>
        <soapenv:Body>
          <getLastPositions>
            <username>${this.username}</username>
            <password>${this.password}</password>
            <licenseplate>${plate}</licenseplate>
            <limit>${limit}</limit>
          </getLastPositions>
        </soapenv:Body>
      </soapenv:Envelope>
    `.trim();

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml;charset=UTF-8',
      SOAPAction: "http://pst.com.br/position.xsd/getLastPositions"
    });

    try {
      const response = await firstValueFrom(
        this.http.post(this.url, soapBody, { headers, responseType: 'text' })
      );
      const parser = new XMLParser({ ignoreAttributes: false });
      const json = parser.parse(response);
      return json.Envelope?.Body?.getLastPositionsResponse?.return || [];
    } catch (error) {
      console.error('Erro ao buscar posições:', error);
      return [];
    }
  }
}

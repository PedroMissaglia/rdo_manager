import { PoNotificationService } from '@po-ui/ng-components';
// vehicle-tracker.component.ts
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PositronService } from '../../services/positron-stomp.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vehicle-tracker',
  standalone: false,
  templateUrl: './vehicle-tracker.component.html',
  styleUrls: ['./vehicle-tracker.component.css'],
})
export class VehicleTrackerComponent implements OnInit {
  plateNumber: string = '';
  currentPosition: any = null;
  positionsHistory: any[] = [];
  connectionStatus: string = 'Desconectado';
  errorMessage: string = '';
  plate!: string;
  form!: FormGroup;
  fields = [
    { property: 'veicId', label: 'ID do Veículo', required: true },
    { property: 'veicTag', label: 'Placa' },
    { property: 'blocked', label: 'Bloqueado', type: 'boolean' },
    // Campos aninhados (GPS)
    { property: 'gps.memory', label: 'Memória GPS', type: 'boolean' },
    { property: 'gps.satellite', label: 'Satélite', type: 'boolean' },
    { property: 'gps.dateGPS', label: 'Data GPS', type: 'datetime' },
    { property: 'gps.long', label: 'Longitude' },
    { property: 'gps.lat', label: 'Latitude' },
    // Campos aninhados (Painel)
    { property: 'panel.ignition', label: 'Ignição', type: 'boolean' },
    { property: 'panel.speed', label: 'Velocidade', type: 'number' }
  ];

  @Input() items: any;

  constructor(
    private positronService: PositronService,
    private notif: PoNotificationService,
    public fb: FormBuilder,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      placa: ['', []],
    });
  }

  async trackVehicle() {
    if (!this.form.get('placa')!.value) {
      this.errorMessage = 'Por favor, informe a placa do veículo';
      return;
    }

    // Obtém a última posição conhecida
    const xmlData = await this.positronService.getServicePackageByPlate(
      this.form.get('placa')!.value
    );

    if (!xmlData) {
      this.notif.warning('Nenhuma nova atualização de posição de veículo')
      return;
    }

    this.currentPosition = this.parseXML(xmlData);

  }

  parseXML(xmlString: any) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const pack = xmlDoc.querySelector('pack');

    if (!pack) {
        throw new Error('Elemento pack não encontrado no XML');
    }

    const gpsElement = pack.querySelector('GPS');
    if (!gpsElement) {
        throw new Error('Elemento GPS não encontrado no pack');
    }

    const long = gpsElement.querySelector('long')?.textContent || '';
    const lat = gpsElement.querySelector('lat')?.textContent || '';
    const address = gpsElement.querySelector('address')?.textContent || '';
    const head = gpsElement.querySelector('head')?.textContent || '';
    const alt = gpsElement.querySelector('alt')?.textContent || '';

    const panel = pack.querySelector('panel');
    if (!panel) {
        throw new Error('Elemento panel não encontrado no pack');
    }

    const ignition = panel.querySelector('ignition')?.textContent || 'false';
    const speed = panel.querySelector('speed')?.textContent || '0';
    const odometer = panel.querySelector('odometer')?.textContent || '0';

    return {
        veicId: pack.getAttribute('veicId') || '',
        veicTag: pack.getAttribute('veicTag') || '',
        blocked: pack.getAttribute('blocked') || 'false',
        gps: {
            memory: gpsElement.getAttribute('memory') || 'false',
            satellite: gpsElement.getAttribute('satellite') || 'false',
            valid: gpsElement.getAttribute('valid') || 'false',
            estimated: gpsElement.getAttribute('estimated') || 'false',
            dateGPS: gpsElement.getAttribute('dateGPS') || '',
            dateSystem: gpsElement.getAttribute('dateSystem') || '',
            long,
            lat,
            address,
            head,
            alt
        },
        panel: {
            ignition,
            speed,
            odometer
        }
    };
}
}

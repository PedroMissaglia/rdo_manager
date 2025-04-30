// vehicle-tracker.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PositronService } from '../../services/positron-stomp.service';

@Component({
  selector: 'app-vehicle-tracker',
  standalone: false,
  templateUrl: './vehicle-tracker.component.html',
  styleUrls: ['./vehicle-tracker.component.css']
})
export class VehicleTrackerComponent implements OnInit, OnDestroy {
  plateNumber: string = '';
  currentPosition: any = null;
  positionsHistory: any[] = [];
  connectionStatus: string = 'Desconectado';
  errorMessage: string = '';

  private positionSubscription!: Subscription;
  private statusSubscription!: Subscription;

  constructor(
    private positronService: PositronService ,
    private readonly sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {
    let packageDescription = await this.positronService.getServicePackageByPlate('ABC1234');
    console.log(packageDescription)
  }


  getSafeMapUrl(lat: number, lng: number): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  trackVehicle(): void {
    if (!this.plateNumber) {
      this.errorMessage = 'Por favor, informe a placa do veículo';
      return;
    }

    // Limpa assinatura anterior se existir
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }

    // Obtém a última posição conhecida
    this.currentPosition = this.positronService.getServicePackageByPlate(this.plateNumber);


  }

  ngOnDestroy(): void {
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }
}

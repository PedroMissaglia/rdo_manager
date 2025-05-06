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
  styleUrls: ['./vehicle-tracker.component.css']
})
export class VehicleTrackerComponent implements OnInit, OnDestroy {
  plateNumber: string = '';
  currentPosition: any = null;
  positionsHistory: any[] = [];
  connectionStatus: string = 'Desconectado';
  errorMessage: string = '';
  plate!: string;
  form!: FormGroup;

  @Input() items: any;

  private positionSubscription!: Subscription;
  private statusSubscription!: Subscription;

  constructor(
    private positronService: PositronService ,
    public fb: FormBuilder,
    private readonly sanitizer: DomSanitizer
  ) { }

  async ngOnInit() {

    this.form = this.fb.group({
      placa: ['', []]
    });

    // let packageDescription = await this.positronService.getServicePackageByPlate('ABC1234');
    // console.log(packageDescription)
  }


  getSafeMapUrl(lat: number, lng: number): SafeResourceUrl {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  trackVehicle(): void {
    if (!this.form.get('placa')!.value) {
      this.errorMessage = 'Por favor, informe a placa do veículo';
      return;
    }

    // Limpa assinatura anterior se existir
    if (this.positionSubscription) {
      this.positionSubscription.unsubscribe();
    }

    // Obtém a última posição conhecida
    this.currentPosition = this.positronService.getServicePackageByPlate(this.form.get('placa')!.value);


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

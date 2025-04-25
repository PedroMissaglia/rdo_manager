import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-map',
  standalone: false,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @Input() apiKey: string = '';
  @Input() locais: any[] = [];

  private map!: google.maps.Map;
  private markers: google.maps.Marker[] = [];

  ngAfterViewInit(): void {
    if (this.locais.length > 0) {
      this.carregarMapa();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['locais'] && this.map) {
      this.carregarMapa();
    }
  }

  private async carregarMapa(): Promise<void> {
    const loader = new Loader({
      apiKey: this.apiKey,
      version: "weekly"
    });

    try {
      await loader.load();
      this.inicializarMapa();
      this.adicionarMarcadores();
    } catch (error) {
      console.error('Erro ao carregar Google Maps:', error);
    }
  }

  private inicializarMapa(): void {
    // Calcula o centro do mapa baseado nas coordenadas
    const bounds = new google.maps.LatLngBounds();
    this.locais.forEach(local => {
      bounds.extend(new google.maps.LatLng(local.latitude, local.longitude));
    });

    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: bounds.getCenter(),
      zoom: 14,
      mapTypeControl: true,
      streetViewControl: false
    });

    // Ajusta o zoom para mostrar todos os marcadores
    this.map.fitBounds(bounds);
  }

  private adicionarMarcadores(): void {
    // Remove marcadores existentes
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];

    this.locais.forEach(local => {
      const marker = new google.maps.Marker({
        position: { lat: local.latitude, lng: local.longitude },
        map: this.map,
        title: local.observacao
      });

      // Adiciona InfoWindow com detalhes
      const infoWindow = new google.maps.InfoWindow({
        content: this.criarConteudoInfoWindow(local)
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });
  }

  private criarConteudoInfoWindow(local: any): string {
    return `
      <div style="font-family: Arial; max-width: 250px;">
        <h4 style="margin: 0 0 10px 0; color: #1a73e8;">${local.observacao || 'Atividade'}</h4>
        <p style="margin: 5px 0;"><strong>Endereço:</strong> ${local.geo || 'Não informado'}</p>
        <p style="margin: 5px 0;"><strong>Horário:</strong> ${local.dataFoto || 'Não informado'}</p>
        ${local.foto ? `<img src="${local.foto}" style="max-width: 200px; max-height: 150px; margin-top: 10px;" onerror="this.style.display='none'">` : ''}
      </div>
    `;
  }
}

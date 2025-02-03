import { CrudService } from './../../services/crud.service';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoButtonGroupItem, PoModalAction, PoModalComponent, PoMultiselectOption, PoNavbarIconAction, PoNavbarItem, PoStepperOrientation, PoTableColumn } from '@po-ui/ng-components';
import { CameraService } from '../../services/camera.service';
import { UserService } from '../../services/user.service';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-daily-log',
  standalone: false,
  templateUrl: './daily-log.component.html',
  styleUrls: ['./daily-log.component.scss']
})
export class DailyLogComponent implements OnInit {
  isNavbarVisible: boolean = false; // Controls mobile navbar visibility
  private trigger: Subject<void> = new Subject<void>();
  // Toggle navbar visibility on mobile
  toggleNavbar(): void {
    this.isNavbarVisible = !this.isNavbarVisible;
  }

  myForm!: FormGroup;

  startedRoute = false;
  image: any;

  serviceOptions = [
    { label: 'Serviço 1', value: '1' },
    { label: 'Serviço 2', value: '2' }
  ];

  labelNow = this.formatDate(new Date());

  // Define the navbar items
  navbarItems: PoNavbarItem[] = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Contact', link: '/contact' }
  ];

  orientation = PoStepperOrientation.Horizontal;

  items: any;

  capturedImage!: string;

  private mediaStream: MediaStream | null = null;

  close: PoModalAction = {
    action: () => {
      this.poModal?.close();
    },
    label: 'Cancelar',
    danger: true
  };

  confirm: PoModalAction = {
    action: () => {
      this.poModal?.close();
      this.startedRoute = true;
    },
    label: 'Confirmar'
  };

  optionsOperators: Array<PoMultiselectOption> = [];
  public deviceId: string = '';
  optionsServices: Array<PoMultiselectOption> = [];
  public webcamImage!: WebcamImage;

  // To handle webcam errors
  public webcamError!: WebcamInitError;

  // A boolean flag to control the webcam
  public showWebcam: boolean = true;
  public allowCameraSwitch = true;

  public videoOptions: MediaTrackConstraints = {
    width: {ideal: 1024},
    height: {ideal: 576}
  };

  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  // Capture the photo
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  // Handle webcam errors
  public handleInitError(error: WebcamInitError): void {
    this.webcamError = error;
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  // Toggle the webcam visibility
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  doSomething() {}

  getDisplayNameAndPlate() {
    return this.userService.user?.displayName! + ' / ' + this.userService.user?.placa!;
  }

  changeOptions(event: any): void {
    this.heroes = [...event];
  }

  getDynamicViewValues() {
    let equipe: string = '';
    this.heroes.forEach((hero, index) => {
      index === 0 ? equipe = equipe.concat(hero.name) : equipe = equipe.concat(', ' + hero.name)
    })

    return
  }

  confirmCamera: PoModalAction = {
    action: () => {
      this.poModalCamera?.close();
      this.startedRoute = true;
    },
    label: 'Confirmar'
  };

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  async loadOperators() {
    try {
      this.items = await this.crudService.getItems('user', 100, 'Operador');
      this.items.map((user: any) => {
        user.value = user.uid;
        user.label = user.displayName;
      });
      this.optionsOperators = [...this.items];
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  async loadServices() {
    try {
      this.items = await this.crudService.getItems('service', 100);
      this.items.map((user: any) => {
        user.value = user.id;
        user.label = user.nome;
      });
      this.optionsServices = [...this.items];
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  openCamera() {

  }

  heroes: Array<any> = [];

  // Shadow option
  navbarShadow: boolean = true;
  latitude: number | null = null;
  longitude: number | null = null;
  errorMessage: string = '';

  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent | undefined;
  @ViewChild('modalTwo', { static: true }) poModalCamera: PoModalComponent | undefined;
  multiselect: Array<string> = ['1495831666871', '1405833068599'];
  columns: Array<PoTableColumn> = [
    { property: 'value', label: 'id' },
    {
      property: 'label',
      label: 'Name',
      type: 'link',
      action: (value: any) => {
        this.openLink(value);
      }
    }
  ];
  contact: any;
  openLink(value: any) {
    window.open(`http://google.com/search?q=${value}`, '_blank');
  }

  service: string = '';
  context: any;
  imageUrl: string = '';
  caption: string = '';

  @ViewChild('videoElement', { static: false })
  videoElement!: ElementRef;
  private stream: MediaStream | undefined;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef;

  constructor(
    private cameraService: CameraService,
    private crudService: CrudService,
    public userService: UserService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.myForm = this.fb.group({
      labelNow: [this.labelNow, [Validators.required]],  // Initialize with a default value
      contact: [this.contact, [Validators.required]],  // Multiselect should be required
      service: [this.service, [Validators.required]]    // Combo should be required
    });

    this.loadOperators();
    this.loadServices();
  }








  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); // Pad single digits with leading zeros
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so add 1
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  // Upload the photo
  uploadPost() {
    if (this.imageUrl && this.caption) {
      const blob = this.dataURLToBlob(this.imageUrl);
      const file = new File([blob], 'photo.png', { type: 'image/png' });
      // this.postService.uploadPost(file, this.caption).subscribe();
      this.caption = '';
      this.imageUrl = ''; // Clear the image after upload
    }
  }

  // Convert base64 string to a Blob
  dataURLToBlob(dataURL: string): Blob {
    const [base64Prefix, base64Data] = dataURL.split(',');
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([uint8Array], { type: 'image/png' });
  }

  getGeoLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          console.log('Location:', this.latitude, this.longitude);
        },
        (error) => {
          this.errorMessage = `Error getting location: ${error.message}`;
          console.error('Error:', error);
        }
      );
    } else {
      this.errorMessage = 'Geolocation is not supported by this browser.';
      console.error('Geolocation is not supported.');
    }
  }

  onHandleStartRoute(action: string) {
    this.poModal?.open();
  }

  onContactChange(value: any): void {
    this.contact = value;
    console.log('Contact changed:', this.contact);
  }

  action(button: any) {
    alert(`${button.label}`);
  }
}

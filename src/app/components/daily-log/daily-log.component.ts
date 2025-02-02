import { CrudService } from './../../services/crud.service';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoButtonGroupItem, PoModalAction, PoModalComponent, PoMultiselectFilter, PoMultiselectOption, PoNavbarIconAction, PoNavbarItem, PoStepperOrientation, PoTableColumn } from '@po-ui/ng-components';
import { CameraService } from '../../services/camera.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-daily-log',
  standalone: false,
  templateUrl: './daily-log.component.html',
  styleUrl: './daily-log.component.scss'
})
export class DailyLogComponent implements OnInit, OnDestroy, AfterViewInit{
  isNavbarVisible: boolean = false; // Controls mobile navbar visibility
  // Toggle navbar visibility on mobile
  toggleNavbar(): void {
    this.isNavbarVisible = !this.isNavbarVisible;
  }

  myForm!: FormGroup;

  startedRoute = false;

  buttons1: Array<PoButtonGroupItem> = [
    { label: 'Coletar fotos', action: this.takePhoto.bind(this), icon: 'an an-camera', disabled: this.myForm?.invalid }
  ];

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

  // Define icon actions for the navbar
  iconActions: PoNavbarIconAction[] = [
    {
      icon: 'po-icon-search', action: () => alert('Search clicked!'),
      label: 'JHJJJJ'
    },
    {
      icon: 'po-icon-help', action: () => alert('Help clicked!'),
      label: 'JHJHJHJ'
    }
  ];
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
      this.startedRoute = true
    },
    label: 'Confirmar'
  };

  optionsOperators: Array<PoMultiselectOption> = [];
  optionsServices: Array<PoMultiselectOption> = [];

  getDisplayNameAndPlate() {
    return this.userService.user?.displayName! + ' / ' + this.userService.user?.placa!;
  }

  confirmCamera: PoModalAction = {
    action: () => {
      this.poModalCamera?.close();
      this.startedRoute = true
    },
    label: 'Confirmar'
  };

  async loadOperators() {
    try {
      this.items = await this.crudService.getItems('user', 100, 'Operador');
      this.items.map((user: any) => {
        user.value = user.uid;
        user.label = user.displayName;
      } )
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
      } )
      this.optionsServices = [...this.items];
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  openCamera() {

  }

  heroes: Array<any> = [];

  // Logo and alternative text
  logoUrl: string = 'assets/swl_logo.png';
  logoAlt: string = 'My Application Logo';

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

  private videoElement!: HTMLVideoElement;
  private stream: MediaStream | undefined;
  private canvasElement!: HTMLCanvasElement | undefined;
  private canvasContext!: CanvasRenderingContext2D | null;

  @ViewChild('videoElement') videoElementRef!: ElementRef<HTMLVideoElement>;

  constructor(
    private cameraService: CameraService,
    private crudService: CrudService,
    public userService: UserService,
    private fb: FormBuilder)
  {}

  ngAfterViewInit() {
    const videoElement = this.videoElementRef.nativeElement;

    // Start the camera after the view is initialized
    this.getBackCameraStream(videoElement);
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      labelNow: [this.labelNow, [Validators.required]],  // Initialize with a default value
      contact: [this.contact, [Validators.required]],  // Multiselect should be required
      service: [this.service, [Validators.required]]    // Combo should be required
    });

    this.loadOperators();
    this.loadServices();

    this.initializeCamera();
  }

  ngOnDestroy(): void {
    if (this.mediaStream) {
      const tracks = this.mediaStream.getTracks();
      tracks.forEach(track => track.stop());
    }
  }

  private initializeCamera() {
    const constraints = {
      video: {
        facingMode: 'environment', // This targets the back camera
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.stream = stream;
        this.videoElement = <HTMLVideoElement>document.querySelector('video');
        this.videoElement.srcObject = stream;
        this.videoElement.play();
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
      });
  }


  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); // Pad single digits with leading zeros
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so add 1
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  getBackCameraStream(videoElement: HTMLVideoElement) {
    // Get all media devices
    navigator.mediaDevices.enumerateDevices().then(devices => {
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      // Find the back camera using labels
      const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment'));

      if (backCamera) {
        // Access the back camera using getUserMedia
        const constraints = {
          video: {
            deviceId: backCamera.deviceId, // Use the back camera deviceId
          }
        };

        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          videoElement.srcObject = stream;
          videoElement.play();
        }).catch((err) => {
          console.error('Error accessing back camera: ', err);
        });
      } else {
        console.error('Back camera not found');
      }
    });
  }

  capturePhoto(): void {
    this.canvasElement = <HTMLCanvasElement>document.createElement('canvas');
    this.canvasContext = this.canvasElement.getContext('2d');

    // Set canvas dimensions to video dimensions
    this.canvasElement.width = this.videoElement.videoWidth;
    this.canvasElement.height = this.videoElement.videoHeight;

    // Draw the current frame from the video onto the canvas
    this.canvasContext?.drawImage(this.videoElement, 0, 0, this.canvasElement.width, this.canvasElement.height);

    // Convert the canvas to an image
    const imageUrl = this.canvasElement.toDataURL('image/png');

    // Log the captured image URL (You can display or upload the image here)
    console.log(imageUrl);

    // Optionally, you can display the captured photo in the HTML
    const imgElement = <HTMLImageElement>document.getElementById('capturedImage');
    imgElement.src = imageUrl;
  }

  changeOptions(event: any): void {
    this.heroes = [...event];
  }

  getDynamicViewValues() {
    let equipe: string = '';
    this.heroes.forEach((hero, index) => {
      index === 0 ? equipe = equipe.concat(hero.name) : equipe = equipe.concat(', ' + hero.name)
    })

    return JSON.parse(`{ "data": "${this.labelNow}", "equipe": "${equipe}" }`)
  }


  // Capture photo from the video stream
  takePhoto() {
    const videoElement = this.videoElementRef.nativeElement;

    if (!videoElement) {
      console.error('Video element is not available');
      return;
    }

    // Create a canvas to capture the video frame
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      // Set canvas size to match the video element
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // Draw the current video frame onto the canvas
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Get the base64 image from the canvas
      this.imageUrl = canvas.toDataURL('image/png');
    }
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

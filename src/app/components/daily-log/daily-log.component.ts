import { DailyLogService } from './../../services/daily-log.service';
import { CrudService } from './../../services/crud.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  PoButtonGroupItem,
  PoComboComponent,
  PoModalAction,
  PoModalComponent,
  PoMultiselectComponent,
  PoMultiselectOption,
  PoNavbarIconAction,
  PoNavbarItem,
  PoNotificationService,
  PoSlideItem,
  PoStepperComponent,
  PoStepperOrientation,
  PoTableColumn,
  PoToolbarAction,
  PoToolbarProfile,
} from '@po-ui/ng-components';
import { CameraService } from '../../services/camera.service';
import { UserService } from '../../services/user.service';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { finalize, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-daily-log',
  standalone: false,
  templateUrl: './daily-log.component.html',
  styleUrls: ['./daily-log.component.scss'],
})
export class DailyLogComponent implements OnInit, OnDestroy {
  isNavbarVisible: boolean = false; // Controls mobile navbar visibility
  private trigger: Subject<void> = new Subject<void>();

  myForm!: FormGroup;
  mySecondForm!: FormGroup;
  myThirdForm!: FormGroup;

  profile: PoToolbarProfile = {
    title: '',
  };
  profileActions: Array<PoToolbarAction> = [
    {
      icon: 'an an-sign-out',
      label: 'Sair',
      type: 'danger',
      separator: true,
      action: (item: any) => {
        this.userService.logout();
        this.router.navigate(['login']);
      },
    },
  ];
  startedRoute = false;
  image: any;

  labelNow = this.formatDate(new Date());

  // Define the navbar items
  navbarItems: PoNavbarItem[] = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Contact', link: '/contact' },
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
    danger: true,
  };

  confirm: PoModalAction = {
    action: async () => {
      const id = this.crudService.generateFirebaseId();

      const match = this.labelNow.match(/(\d{2}:\d{2})$/);
      const time = match ? match[1] : null;
      let date = new Date();

      const currentDate = this.getDate();

      // Verifica se a obra já foi iniciada
      const currentDailyLog: Array<any> =
        (await this.crudService.getItems(
          'rdo',
          1,
          'cliente',
          this.userService.getUser().cliente
        )) ?? [];

      if (currentDailyLog.length) {
        currentDailyLog[0].dailyReport.push({
          dataInicioDisplay: this.labelNow.substring(0, 10),
          dataInicio: new Date(),
          horaInicio: time,
          horasPrevistas: '08:00',
          placa: this.userService.getUser().placa,
          operadores: this.heroes,
          status: 'started',
          info: 'started',
          user: this.userService.getUser().login,
          foto: [],
          id: id,
        });

        const itemAdded = await this.crudService.updateItem(
          'rdo',
          currentDailyLog[0].id,
          {
            dailyReport: currentDailyLog[0].dailyReport,
          }
        );

        this.dailyLogService.item = currentDailyLog[0];

        this.poModal?.close();
        this.poStepperComponent.next();
      } else {
        const itemAdded = await this.crudService.addItem(
          'rdo',
          {
            displayNameCliente: this.userService.getUser().displayNameCliente,
            cliente: this.userService.getUser().cliente,
            horasPrevistasTotal: '',
            horasRealizadasTotal: '',
            acoes: '',
            status: '',
            dailyReport: [
              {
                dataInicioDisplay: this.labelNow.substring(0, 10),
                dataInicio: new Date(),
                horaInicio: time,
                horasPrevistas: '08:00',
                placa: this.userService.getUser().placa,
                operadores: this.heroes,
                status: 'started',
                info: 'started',
                user: this.userService.getUser().login,
                foto: [],
                id: id,
              },
            ],
            id: id,
          },
          id
        );

        if (itemAdded) {
          this.dailyLogService.item = itemAdded;

          const updatedItem = await this.crudService.updateItem(
            'rdo',
            this.dailyLogService.item.id,
            {
              id: this.dailyLogService.item.id,
            }
          );

          this.poModal?.close();
          this.poStepperComponent.next();
        }
      }
    },
    label: 'Confirmar',
  };

  closePhoto: PoModalAction = {
    action: () => {
      this.poModalCamera?.close();
    },
    label: 'Cancelar',
    danger: true,
  };

  confirmPhoto: PoModalAction = {
    action: async () => {
      const currentDate = this.getDate();
      const labelNow = this.formatDate(new Date());
      const match = labelNow.match(/(\d{2}:\d{2})$/);
      const time = match ? match[1] : null;

      try {
        // 1. Primeiro fazemos o upload da foto
        if (!this.webcamImage?.imageAsDataUrl) {
          this.notificationService.error('Nenhuma foto foi capturada.');
          return;
        }

        // Converter dataUrl para Blob
        const blob = this.dataURItoBlob(this.webcamImage.imageAsDataUrl);
        const file = new File([blob], `foto_${Date.now()}.jpg`, { type: 'image/jpeg' });

        // Mostrar loading enquanto faz upload
        this.notificationService.information('Enviando foto...');

        // 2. Fazer upload para o Storage
        const downloadUrl = await this.storageService.uploadFile(file, 'fotos-daily-report').toPromise();

        // 3. Atualizar o objeto com a URL da foto
        this.dailyLogService.item.dailyReport.forEach((dailyReport: any) => {
          if (dailyReport.dataInicioDisplay === currentDate) {
            dailyReport.foto.push({
              foto: downloadUrl, // Usamos a URL do Storage agora
              dataFoto: time,
              observacao: this.mySecondForm.get('obs')!.value,
              latitude: this.latitude,
              longitude: this.longitude,
            });
          }
        });

        const dailyReportArray = [...this.dailyLogService.item.dailyReport];

        // 4. Atualizar no banco de dados
        const updatedItem = await this.crudService.updateItemWithPhoto(
          'rdo',
          this.dailyLogService.item.id,
          {
            dailyReport: dailyReportArray,
          },
          {}
        );

        this.poModalCamera?.close();
        this.notificationService.success('Foto salva com sucesso.');

      } catch (error) {
        console.error('Erro ao salvar foto:', error);
        this.notificationService.error('Erro ao salvar foto. Tente novamente.');
      }
    },
    label: 'Enviar',
  };

  private dataURItoBlob(dataURI: string): Blob {
    // Converter base64 para bytes
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // Escrever bytes do array
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  @ViewChild(PoStepperComponent)
  poStepperComponent!: PoStepperComponent;
  @ViewChild(PoComboComponent)
  poComboComponent!: PoComboComponent;
  optionsOperators: Array<PoMultiselectOption> = [];
  public deviceId: string = '';
  optionsServices: Array<PoMultiselectOption> = [];
  public webcamImage!: WebcamImage;
  public webcamImageImprodutiva!: WebcamImage;

  // To handle webcam errors
  public webcamError!: WebcamInitError;

  // A boolean flag to control the webcam
  public showWebcam: boolean = true;
  public allowCameraSwitch = true;

  public videoOptions: MediaTrackConstraints = {
    width: { ideal: 1024 },
    height: { ideal: 576 },
  };

  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  public triggerSnapshot(): void {
    this.labelNow = this.formatDate(new Date());
    this.trigger.next();
    this.poModalCamera?.open();
    this.getGeoLocation();
  }

  public triggerSnapshotHoraImprodutiva(): void {
    this.labelNow = this.formatDate(new Date());
    this.trigger.next();
    this.getGeoLocation();
  }

  photoTaken = false;

  public webcamImages: WebcamImage[] = []; // Array to store snapshots

  // Capture the photo
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.photoTaken = true;
    this.myForm.get('upload')?.setValue(webcamImage.imageAsDataUrl);
  }


  // Capture the photo
  public handleImageImprodutiva(webcamImage: WebcamImage): void {
    this.webcamImageImprodutiva = webcamImage;
  }

  // Handle webcam e
  public handleInitError(error: WebcamInitError): void {
    this.webcamError = error;
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  getDisplayNameAndPlate() {
    return (
      this.userService.getUser()?.displayName! +
      ' / ' +
      this.userService.getUser()?.placa!
    );
  }

  changeOptions(event: any): void {
    this.heroes = [...event];
  }

  handleStepper() {
    this.poStepperComponent.next();
  }

  confirmCamera: PoModalAction = {
    action: () => {
      this.poModalCamera?.close();
      this.startedRoute = true;
    },
    label: 'Confirmar',
  };

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  async loadOperators() {
    try {
      this.items = await this.crudService.getItems(
        'user',
        100,
        'type',
        'Operador'
      );
      this.items.map((user: any) => {
        user.value = user.id;
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
      this.items.map((service: any) => {
        service.value = service.id;
        service.label = service.nome;
      });
      this.optionsServices = [...this.items];
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }

  heroes: Array<any> = [];

  // Shadow option
  navbarShadow: boolean = true;
  latitude: number | null = null;
  longitude: number | null = null;
  errorMessage: string = '';

  @ViewChild(PoModalComponent, { static: true }) poModal:
    | PoModalComponent
    | undefined;
  @ViewChild('modalTwo', { static: true }) poModalCamera:
    | PoModalComponent
    | undefined;

  @ViewChild('modalThree', { static: true }) poModalHoraImprodutiva:
    | PoModalComponent
    | undefined;

  contact: any;
  service: string = '';
  context: any;
  imageUrl: string = '';
  caption: string = '';
  private intervalo: any;

  @ViewChild('videoElement', { static: false })
  videoElement!: ElementRef;
  private stream: MediaStream | undefined;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef;
  @ViewChild(PoMultiselectComponent, { static: false })
  multiSelectComponent!: PoMultiselectComponent;

  constructor(
    private cameraService: CameraService,
    private crudService: CrudService,
    private storageService: StorageService,
    public userService: UserService,
    private dailyLogService: DailyLogService,
    private router: Router,
    private notificationService: PoNotificationService,
    private fb: FormBuilder
  ) {}

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  ngOnInit(): void {

    this.profile = {
      subtitle: this.userService.getUser()?.login ?? '',
      title: this.userService.getUser()?.displayName ?? '',
    };
    this.atualizarHora();
    this.intervalo = setInterval(() => {
      this.atualizarHora();
    }, 1000);  // Atualiza a hora a cada 1000ms (1 segundo)


    this.myForm = this.fb.group({
      labelNow: [this.labelNow, [Validators.required]], // Initialize with a default value
      contact: [this.contact, [Validators.required]], // Multiselect should be required
      service: [this.service, [Validators.required]], // Combo should be required
    });

    this.mySecondForm = this.fb.group({
      obs: ['', []], // Initialize with a default value
      type: [true, []], // Initialize with a default value
    });

    this.myThirdForm = this.fb.group({
      occo: ['', []], // Initialize with a default value
      justificativaImprodutiva: ['', []], // Initialize with a default value
      totalImprodutiva: ['', []], // Initialize with a default value
      responsavel: ['', []], // Initialize with a default value
    });

    this.loadOperators();
    this.loadServices();

    this.getCurrentDailyLog();
  }

  atualizarHora() {
    this.labelNow = this.formatDate(new Date());
  }

  upload: any;

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); // Pad single digits with leading zeros
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so add 1
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  }

  startedDailyLog = false;

  async getCurrentDailyLog() {
    const formattedDate = this.getDate();

    const currentDailyLog: Array<any> =
      (await this.crudService.getItems(
        'rdo',
        1,
        'cliente',
        this.userService.getUser().cliente
      )) ?? [];

    // Obra iniciada
    if (currentDailyLog.length) {
      currentDailyLog[0].dailyReport.forEach((dailyReport: any) => {
        if (dailyReport.user === this.userService.getUser().login) {
          // Acesso ao registro diário pela segunda vez ou mais
          if (formattedDate === dailyReport.dataInicioDisplay) {
            if (!(dailyReport.status === 'finished')) {
              this.dailyLogService.item = currentDailyLog[0];
              this.startedDailyLog = true;
              this.poStepperComponent.next();
            }
          }
        }
      });
    }
  }

  getDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so add 1
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  getGeoLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },

      );
    } else {
      this.errorMessage = 'Geolocation is not supported by this browser.';
      console.error('Geolocation is not supported.');
    }
  }

  onHandleStartRoute(action: string) {
    this.poModal?.open();
  }

  isDifferenceGreaterThanOrEqualToEightHours(
    initialDate: Date,
    finalDate: Date
  ): boolean {
    // Get the difference in milliseconds
    const differenceInMillis = finalDate.getTime() - initialDate.getTime();

    // 8 hours in milliseconds
    const eightHoursInMillis = 8 * 60 * 60 * 1000;

    // Check if the difference is equal to or greater than 8 hours
    return differenceInMillis >= eightHoursInMillis;
  }

  async onHandleCollectSigns() {
    const endDate = this.formatDate(new Date());
    // Use regex to extract the time (HH:mm format)
    const match = endDate.match(/(\d{2}:\d{2})$/);
    const endTime = match ? match[1] : null;

    // Subtração das datas em milissegundos
    let date = new Date();
    let dataInicio: any = new Date();

    const currentDate = this.getDate();

    this.dailyLogService.item.dailyReport.forEach((daily: any) => {
      if (
        daily.dataInicioDisplay === currentDate &&
        daily.user === this.userService.getUser().login
      ) {
        dataInicio = daily.dataInicio;

        const isTimestamp = dataInicio?.seconds ? true : false;

        let workedHours = this.calculate(
          isTimestamp ? new Date(dataInicio.seconds * 1000) : new Date(dataInicio),
          date
        );
        let a = this.isDifferenceGreaterThanOrEqualToEightHours(
          isTimestamp ? new Date(dataInicio.seconds * 1000) : new Date(dataInicio),
          date
        );

        daily['horasRealizadas'] = workedHours;
        (daily['dataFim'] = date),
          (daily['dataFimDisplay'] = this.formatDate(date).substring(0, 10)),
          (daily['justificativa'] = this.myThirdForm.get('occo')?.value),
          (daily['responsavel'] = this.myThirdForm.get('responsavel')?.value),
          (daily['horaFim'] = endTime),
          (daily['status'] = 'finished'),
          (daily['horasRealizadas'] = workedHours),
          (daily['info'] = a ? 'positive' : 'negative');
      }
    });

    const dailyReportArray = [...this.dailyLogService.item.dailyReport];

    const updatedItem = await this.crudService.updateItem(
      'rdo',
      this.dailyLogService.item.id,
      {
        dailyReport: dailyReportArray,
      }
    );

    if (updatedItem) {
      this.reloadPage();
    }
  }

  // Função para calcular a diferença entre dois tempos representados como objetos Date
  calculate(initialDate: Date, finalDate: Date): string {
    // Get the difference in milliseconds
    const differenceInMillis = finalDate.getTime() - initialDate.getTime();

    // Calculate the difference in hours and minutes
    const hours = Math.floor(differenceInMillis / (1000 * 60 * 60)); // 1 hour = 1000 * 60 * 60 ms
    const minutes = Math.floor(
      (differenceInMillis % (1000 * 60 * 60)) / (1000 * 60)
    ); // 1 minute = 1000 * 60 ms

    // Format as hh:mm
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}`;

    return formattedTime;
  }

  reloadPage() {
    this.userService.logout();
    this.router.navigate(['login']);
  }

}

import { Component } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';

@Component({
  selector: 'app-camera',
  standalone: false,
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  // The webcam image captured
  public webcamImage!: WebcamImage;

  // To handle webcam errors
  public webcamError!: WebcamInitError;

  // A boolean flag to control the webcam
  public showWebcam: boolean = true;

  // Capture the photo
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  // Handle webcam errors
  public handleInitError(error: WebcamInitError): void {
    this.webcamError = error;
  }

  // Toggle the webcam visibility
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
}

// camera.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  // Mock method to return a static image as a mock camera feed
  public getCameraStream(): Promise<MediaStream | null> {
    return new Promise((resolve, reject) => {
      const imageElement = document.createElement('img');  // Create an image element
      imageElement.src = 'assets/mock-image.jpg';  // Path to a static image
      imageElement.alt = 'Mock Camera Feed';
      // Resolve with the "video feed"
      imageElement.onload = () => {
        resolve(null);  // No actual stream, just the video element with the image
      };

      imageElement.onerror  = (err) => {
        reject('Error loading mock image: ' + err);
      };
    });
  }

  // Method to simulate a camera feed using a static image
  public getCameraImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      const imageUrl = 'assets/mock-image.jpg';  // Path to your static image

      // Check if the image exists (by loading it)
      const imageElement = new Image();
      imageElement.src = imageUrl;

      imageElement.onload = () => {
        resolve(imageUrl);  // Resolve with the image URL when it's loaded successfully
      };

      imageElement.onerror = (err) => {
        reject('Error loading mock image: ' + err);  // Reject if the image fails to load
      };
    });
  }
}

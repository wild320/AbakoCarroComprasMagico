import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(private storageService: StorageService) { }

  // Set the JSON data to local
  setJsonValue(key: string, value: any) {
    this.storageService.setItem(key, value);
  }

  // Get the JSON value from local
  getJsonValue(key: string) {
    return this.storageService.getItem(key);
  }

  setJsonValueSession(key: string, value: any) {
    this.storageService.setItem(key, value);
  }

  // Get the JSON value from session
  getJsonValueSession(key: string) {
    return this.storageService.getItem(key);
  }

  // Clear the local storage
  clearToken() {
    this.storageService.clear();
  }
}

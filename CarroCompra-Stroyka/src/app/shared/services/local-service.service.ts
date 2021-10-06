import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(private storageService: StorageService) { }

  // Set the json data to local
  setJsonValue(key: string, value: any) {
    this.storageService.secureStorage.setItem(key, value);
  }
  // Get the json value from local
  getJsonValue(key: string) {
    return this.storageService.secureStorage.getItem(key);

  }

  setJsonValueSession(key: string, value: any) {
    this.storageService.secureStorageSession.setItem(key, value);
  }
  // Get the json value from local
  getJsonValueSession(key: string) {
    return this.storageService.secureStorageSession.getItem(key);

  }


  
  // Clear the local
  clearToken() {
    return this.storageService.secureStorage.clear();
  }
}

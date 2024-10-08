import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { StorageService } from './storage.service';import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private isBrowser: boolean;

  constructor(
    private storageService: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Set the JSON data to local storage
  setJsonValue(key: string, value: any) {
    if (this.isBrowser) {
      this.storageService.setItem(key, value);
    }
  }

  // Get the JSON value from local storage
  getJsonValue(key: string) {
    return this.storageService.getItem(key) ?? null;

  }

  setJsonValueSession(key: string, value: any) {
    if (this.isBrowser) {
      this.storageService.setItem(key, value);
    }
  }

  // Get the JSON value from session storage
  getJsonValueSession(key: string) {
    if (this.isBrowser) {
      return this.storageService.getItem(key);
    }
  }

  // Clear the local storage
  clearToken() {
    if (this.isBrowser) {
      this.storageService.clear();
    }
  }
}

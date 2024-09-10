import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private platformId: Object;
  secureStorage: Storage;
  secureStorageSession: Storage;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId;
    if (isPlatformBrowser(this.platformId)) {
      this.secureStorage = localStorage;
      this.secureStorageSession = sessionStorage;
    }
  }

  setItem(key: string, value: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.secureStorage.setItem(key, JSON.stringify(value));
    }
  }

  getItem(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      const item = this.secureStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  }

  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.secureStorage.removeItem(key);
    }
  }

  clear() {
    if (isPlatformBrowser(this.platformId)) {
      this.secureStorage.clear();
    }
  }
}

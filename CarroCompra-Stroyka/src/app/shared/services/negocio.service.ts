import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

// Contantes
import { Cconfiguracion } from '../../../data/contantes/cConfiguracion';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {
  configuracion: any = {};
  UrlJsonConfguracion: string;
  headers: HttpHeaders = new HttpHeaders();

  constructor(
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const base = document.getElementsByTagName('base')[0].href;
      this.UrlJsonConfguracion = base + Cconfiguracion.urlAssetsConfiguracion + Cconfiguracion.JsonConfiguracion;
    } else {
      // Handle server-side rendering case
      this.UrlJsonConfguracion = ''; // Set a default value or handle it differently
    }
  }

  cargarConfiguracionLocal() {
    if (isPlatformBrowser(this.platformId)) {
      this.headers = this.headers.append('Access-Control-Allow-Origin', '*');

      const options = {
        headers: this.headers
      };

      return this.httpClient.get(this.UrlJsonConfguracion, options)
        .toPromise()
        .then((config: any) => {
          this.configuracion = config;
        })
        .catch((err: any) => {
          console.error('Error leyendo json de configuracion:' + err);
        });
    } else {
      // Handle server-side case if necessary
      return Promise.resolve(); // Or handle it differently
    }
  }
}

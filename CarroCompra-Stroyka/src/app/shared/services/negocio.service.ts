import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

// Contantes
import { Cconfiguracion } from '../../../data/contantes/cConfiguracion';
import { CServicios } from 'src/data/contantes/cServicios';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  httpClient = inject(HttpClient);

  headers: HttpHeaders = new HttpHeaders();

  UrlJsonConfguracion: string;
  
  UrlServicioCarroCompras: string;

  configuracion: any = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const base = document.getElementsByTagName('base')[0].href;
      this.UrlJsonConfguracion = base + Cconfiguracion.urlAssetsConfiguracion + Cconfiguracion.JsonConfiguracion;
     
    } 
  }

  async loadSettingsFromServer(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      this.headers = this.headers.append('Access-Control-Allow-Origin', '*');

      const options = {
        headers: this.headers
      };

      return this.httpClient.get(this.UrlJsonConfguracion, options)
        .toPromise()
        .then((config: any) => {
          this.configuracion = config;
          this.UrlServicioCarroCompras = `${this.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioConfiguracionCC}`;
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

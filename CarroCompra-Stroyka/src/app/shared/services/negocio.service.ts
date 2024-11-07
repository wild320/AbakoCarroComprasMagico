import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

// Contantes
import { CServicios } from 'src/data/contantes/cServicios';
import { Cconfiguracion } from '../../../data/contantes/cConfiguracion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  httpClient = inject(HttpClient);

  headers: HttpHeaders = new HttpHeaders();

  UrlJsonConfguracion: string;

  UrlServicioCarroCompras: string;

  configuracion: any = {};

  constructor() {
    this.UrlJsonConfguracion = `${environment.apiUrl}${Cconfiguracion.urlAssetsConfiguracion}${Cconfiguracion.JsonConfiguracion}`;

  }

  async loadSettingsFromServer(): Promise<void> {
    try {
        const options = { headers: this.headers.set('Access-Control-Allow-Origin', '*') };
        const config = await this.httpClient.get<any>(this.UrlJsonConfguracion, options).toPromise();

        this.configuracion = config;
        this.UrlServicioCarroCompras = `${this.configuracion.UrlServicioCarroCompras}${CServicios.ApiCarroCompras}${CServicios.ServicioConfiguracionCC}`;
    } catch (err) {
        console.error('Error leyendo configuration JSON:', err);
    }
}

}

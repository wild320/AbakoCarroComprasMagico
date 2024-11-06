import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

// Contantes
import { CServicios } from 'src/data/contantes/cServicios';
import { Cconfiguracion } from '../../../data/contantes/cConfiguracion';

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
    this.UrlJsonConfguracion = 'http://localhost:4300/' + Cconfiguracion.urlAssetsConfiguracion + Cconfiguracion.JsonConfiguracion;

  }

  async loadSettingsFromServer(): Promise<any> {
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
  }
}

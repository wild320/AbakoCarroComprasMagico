import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    private httpClient: HttpClient) {

        const base = document.getElementsByTagName('base')[0].href;

        this.UrlJsonConfguracion = base  + Cconfiguracion.urlAssetsConfiguracion + Cconfiguracion.JsonConfiguracion;

    }

  cargarConfiguracionLocal() {

    this.headers.append('Access-Control-Allow-Origin', '*');

    const options = {
      headers: this.headers
    };

    return this.httpClient.get( this.UrlJsonConfguracion, options)
        .toPromise()
        .then((config: any) => {
          this.configuracion = config;

        })
        .catch((err: any) => {
            console.error('Error leyendo json de configuracion:' + err);
        });
  }

  

}

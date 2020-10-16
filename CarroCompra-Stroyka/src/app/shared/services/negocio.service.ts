import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


// Contantes
import { Cconfiguracion } from '../../../data/contantes/cConfiguracion';


@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  configuracion: any = {};
  UrlJsonConfguracion: string;


  constructor(
    private httpClient: HttpClient) {

        const base = document.getElementsByTagName('base')[0].href;

        this.UrlJsonConfguracion = base  + Cconfiguracion.urlAssetsConfiguracion + Cconfiguracion.JsonConfiguracion;

    }

  cargarConfiguracionLocal() {
    return this.httpClient.get( this.UrlJsonConfguracion)
        .toPromise()
        .then((config: any) => {
          this.configuracion = config;

        })
        .catch((err: any) => {
            console.error('Error leyendo json de configuracion:' + err);
        });
  }

}

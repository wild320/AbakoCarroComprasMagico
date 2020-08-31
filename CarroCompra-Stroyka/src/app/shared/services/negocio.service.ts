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

        this.UrlJsonConfguracion = './' + Cconfiguracion.urlAssetsConfiguracion + Cconfiguracion.JsonConfiguracion;

    }

  cargarConfiguracionLocal() {
    return this.httpClient.get( this.UrlJsonConfguracion)
        .toPromise()
        .then((config: any) => {
          this.configuracion = config;

        })
        .catch((err: any) => {
            console.error(err);
        });
  }

}

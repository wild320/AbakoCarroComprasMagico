import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NegocioService } from './negocio.service';

// Contantes
import { CServicios } from 'src/data/contantes/cServicios';
import { ServiceHelper } from './ServiceHelper';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  headers: HttpHeaders = new HttpHeaders();
  infoBanner
  private UrlServicio: string;


  constructor(private httpClient: HttpClient,
              private negocio: NegocioService,
              private servicehelper: ServiceHelper<any, any>) {  }

  cargarBanner(): Promise<any> {
  this.UrlServicio = this.negocio.configuracion.UrlServicioCarroCompras + CServicios.ApiCarroCompras + CServicios.ServicioBanner
    const info = {
      
        "proceso": "GET",
        "idBanner": 1,
        "descripcion": "string",
        "imagenClasica": "string",
        "imagenFull": "string",
        "imagenMobile": "string",
        "codigoReenvio": "string",
        "usuario": 0
      
    };

    return this.servicehelper
    .PostData(this.UrlServicio, info)
    .toPromise()
    .catch((err: any) => {
      console.error('Error:' + err);
    });

  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
  httpClient = inject(HttpClient);  
  private negocio = inject(NegocioService);
  private servicehelper = inject(ServiceHelper<any, any>)

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

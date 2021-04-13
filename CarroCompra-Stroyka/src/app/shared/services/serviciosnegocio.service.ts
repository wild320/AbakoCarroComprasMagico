import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';


@Injectable({
  providedIn: 'root'
})
export class ServiciosnegocioService {

  private UrlServicioFecha: string;
  public latitude: number;
  public longitude: number;

  constructor(private httpClient: HttpClient,
              private negocio: NegocioService) { }

  public RecuperarFechayHora(){

    this.UrlServicioFecha =
    this.negocio.configuracion.UrlServicioCarroCompras +
    CServicios.ApiNegocio +
    CServicios.ServicioFechaServidor;

    return this.httpClient.get(this.UrlServicioFecha , { responseType: 'text' }).toPromise();

  }

  private getPosition(): Promise<any> {

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
      },
      err => {

        if (err.code == err.TIMEOUT) {
          console.log ("Se ha superado el tiempo de espera");
        }
          
        if (err.code == err.PERMISSION_DENIED)   {
          console.log ("El usuario no permitió informar su posición");
        }   

        if (err.code == err.POSITION_UNAVAILABLE)   {
          console.log ("El dispositivo no pudo recuperar la posición actual");
        }              
        
        resolve({lng: 0, lat: 0});;

      });
          
    });

  }

  public getLocation() {
    this.getPosition().then(pos => {
        this.latitude = pos.lat;
        this.longitude = pos.lng;
    });
  }


}

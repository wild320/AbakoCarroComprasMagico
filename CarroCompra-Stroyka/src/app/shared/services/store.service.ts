import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    UrlServicioCarroCompras: string;
    address = '';
    email = '';
    phone = '';
    hours = '';

    constructor(private httpClient: HttpClient,
                private negocio: NegocioService) {  }

    cargarConfiguracionGeneral() {

        this.UrlServicioCarroCompras = this.negocio.configuracion.UrlServicioCarroCompras +  CServicios.ApiCarroCompras +
        CServicios.ServicioConfiguracionCC;

        return this.httpClient.get(this.UrlServicioCarroCompras + '/1')
            .toPromise()
            .then((config: any) => {
                this.SetiarInformacion (config);

            })
            .catch((err: any) => {
                console.error(err);
            });
      }

      private SetiarInformacion(configuracion: any){
        console.log (configuracion);

        configuracion.forEach(element => {

            // Hora de servicio
            if (element.id === 'A1'){
                this.hours =  element.valor;
            }

            // Direccion
            if (element.id === 'B1'){
                this.address =  element.valor;
            }

            // telefono
            if (element.id === 'B2'){
                this.phone =  element.valor;
            }

            // correo
            if (element.id === 'B3'){
                this.email =  element.valor;
            }

        });
      }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';

// Modelos
import { Paginas } from '../../../data/modelos/negocio/paginas';

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';


@Injectable({
  providedIn: 'root'
})
export class PaginasService {

  UrlServicioPaginas: string;
  paginas: Paginas[];
  AcecaNosotros: string;

  constructor(
      private httpClient: HttpClient,
      private negocio: NegocioService
    ) {

   }

   public iniciarPaginas() {

      // ojo no cambiar el orden, con este se recupera en el html
      this.paginas = [
        {
          Id: 1,
          Pagina: 'Nosotros',
          Activo: false
        },
        {
          Id: 2,
          Pagina: 'Envio',
          Activo: false
        },
        {
          Id: 3,
          Pagina: 'Terminos',
          Activo: false
        },
        {
          Id: 4,
          Pagina: 'Politicas',
          Activo: false
        },
        {
          Id: 5,
          Pagina: 'Blog',
          Activo: false
        },
        {
          Id: 6,
          Pagina: 'FAQ',
          Activo: false
        },
        {
          Id: 7,
          Pagina: 'Contactenos',
          Activo: false
        },
      ];

   }

   public cargarPagina(tipoPagina: number ) {

    this.UrlServicioPaginas = this.negocio.configuracion.UrlServicioCarroCompras +  CServicios.ApiCarroCompras +
    CServicios.ServicioPaginas;


    return this.httpClient.get(this.UrlServicioPaginas + '/' + tipoPagina.toString(), { responseType: 'text' })
        .toPromise()
        .then((resp: any) => {
            return resp;

        })
        .catch((err: any) => {
            console.error(err);
        });
  }
}

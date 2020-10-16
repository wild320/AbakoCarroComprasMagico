import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Servicios
import { NegocioService } from '../../shared/services/negocio.service';

// Modelos
import { Paginas } from '../../../data/modelos/negocio/paginas';

// Contantes
import { CServicios } from '../../../data/contantes/cServicios';
import { Cpaginas } from '../../../data/contantes/cPaginas';
import { Crutas, ClabelRutas } from '../../../data/contantes/cRutas';


@Injectable({
  providedIn: 'root'
})
export class PaginasService {

  UrlServicioPaginas: string;
  paginas: Paginas[];
  public AcercaNosotros: string;
  public Contatenos: string;
  public TerminosCondiciones: string;
  public InformacionEnvio: string;
  public PoliticasPrivacidad: string;
  public faqs: string;

  constructor(
      private httpClient: HttpClient,
      private negocio: NegocioService
    ) {

   }

   public iniciarPaginas() {

      // ojo no cambiar el orden, con este se recupera en el html
      this.paginas = [
        {
          Id: Cpaginas.acercaNosotros,
          Pagina: 'Nosotros',
          label: ClabelRutas.acecaNosotros,
          url: Crutas.acecaNosotros,
          Activo: false
        },
        {
          Id: Cpaginas.informacionEnvio,
          Pagina: 'Envio',
          label: ClabelRutas.informacionEvio ,
          url: Crutas.informacionEvio,
          Activo: false
        },
        {
          Id: Cpaginas.terminosCondiciones,
          Pagina: 'Terminos',
          label: ClabelRutas.terminosCondiciones ,
          url: Crutas.terminosCondiciones,
          Activo: false
        },
        {
          Id: Cpaginas.politicasPrivacidad,
          Pagina: 'Politicas',
          label: ClabelRutas.politicasPrivacidad ,
          url: Crutas.politicasPrivacidad,
          Activo: false
        },
        {
          Id: Cpaginas.blog,
          Pagina: 'Blog',
          label: '',
          url: '',
          Activo: false
        },
        {
          Id: Cpaginas.fag,
          Pagina: 'FAQ',
          label: ClabelRutas.faq,
          url:  Crutas.faq,
          Activo: false
        },
        {
          Id: Cpaginas.contactenos,
          Pagina: 'Contactenos',
          label: ClabelRutas.contactenos,
          url: Crutas.contactenos,
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

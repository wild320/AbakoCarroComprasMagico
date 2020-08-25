import { Component, OnInit } from '@angular/core';

// servicio
import { PaginasService } from '../../../../shared/services/paginas.service';

// Constantes
import { Cpaginas } from '../../../../../data/contantes/cPaginas';

@Component({
  selector: 'app-page-info-send',
  templateUrl: './page-info-send.component.html',
  styleUrls: ['./page-info-send.component.scss']
})
export class PageInfoSendComponent  {

  constructor(public pagina: PaginasService) {

    if (this.pagina.InformacionEnvio === '' ||  this.pagina.InformacionEnvio === null
    || this.pagina.InformacionEnvio === undefined ){

      this.pagina.cargarPagina(Cpaginas.informacionEnvio).then((resp: any) => {
          this.pagina.InformacionEnvio = resp;

      }) ;

    }
  }

}

import { Component, OnInit } from '@angular/core';


// servicio
import { PaginasService } from '../../../../shared/services/paginas.service';

// Constantes
import { Cpaginas } from '../../../../../data/contantes/cPaginas';


@Component({
  selector: 'app-page-private',
  templateUrl: './page-private.component.html',
  styleUrls: ['./page-private.component.scss']
})
export class PagePrivateComponent{

  constructor(public pagina: PaginasService) {

    if (this.pagina.PoliticasPrivacidad === '' ||  this.pagina.PoliticasPrivacidad === null
    || this.pagina.PoliticasPrivacidad === undefined ){

      this.pagina.cargarPagina(Cpaginas.politicasPrivacidad).then((resp: any) => {
          this.pagina.PoliticasPrivacidad = resp;

      }) ;

    }



  }


}

import { Component } from '@angular/core';

// servicio
import { PaginasService } from '../../../../shared/services/paginas.service';

// Constantes
import { Cpaginas } from '../../../../../data/contantes/cPaginas';

@Component({
    selector: 'app-terms',
    templateUrl: './page-terms.component.html',
    styleUrls: ['./page-terms.component.scss']
})
export class PageTermsComponent {
    constructor(public pagina: PaginasService) {

        if (this.pagina.TerminosCondiciones === '' ||  this.pagina.TerminosCondiciones === null
        || this.pagina.TerminosCondiciones === undefined ){

            this.pagina.cargarPagina(Cpaginas.terminosCondiciones).then((resp: any) => {
                this.pagina.TerminosCondiciones = resp;

            }) ;

        }
    }
}

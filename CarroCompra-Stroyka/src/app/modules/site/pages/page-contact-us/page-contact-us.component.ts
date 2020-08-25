import { Component } from '@angular/core';


// servicio
import { PaginasService } from '../../../../shared/services/paginas.service';
import { StoreService } from '../../../../shared/services/store.service';

// Constantes
import { Cpaginas } from '../../../../../data/contantes/cPaginas';


@Component({
    selector: 'app-contact-us',
    templateUrl: './page-contact-us.component.html',
    styleUrls: ['./page-contact-us.component.scss']
})
export class PageContactUsComponent {
    constructor(
        public pagina: PaginasService,
        public store: StoreService
        ) {

            if (this.pagina.Contatenos === '' ||  this.pagina.Contatenos === null
            || this.pagina.Contatenos === undefined ){

            this.pagina.cargarPagina(Cpaginas.contactenos).then((resp: any) => {
                this.pagina.Contatenos = resp;

            }) ;

        }

    }
}

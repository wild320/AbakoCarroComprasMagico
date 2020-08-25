import { Component } from '@angular/core';

// servicio
import { PaginasService } from '../../../../shared/services/paginas.service';
import { StoreService } from '../../../../shared/services/store.service';

// Constantes
import { Cpaginas } from '../../../../../data/contantes/cPaginas';


@Component({
    selector: 'app-faq',
    templateUrl: './page-faq.component.html',
    styleUrls: ['./page-faq.component.scss']
})
export class PageFaqComponent {
    constructor(
        public pagina: PaginasService) {

        if (this.pagina.faqs === '' ||  this.pagina.faqs === null
        || this.pagina.faqs === undefined ){

            this.pagina.cargarPagina(Cpaginas.fag).then((resp: any) => {
                this.pagina.faqs = resp;
            }) ;

        }

     }
}

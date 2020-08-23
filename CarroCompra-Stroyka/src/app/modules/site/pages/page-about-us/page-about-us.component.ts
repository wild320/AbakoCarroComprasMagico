import { Component } from '@angular/core';
import { DirectionService } from '../../../../shared/services/direction.service';

// servicio
import { PaginasService } from '../../../../shared/services/paginas.service';

@Component({
    selector: 'app-about-us',
    templateUrl: './page-about-us.component.html',
    styleUrls: ['./page-about-us.component.scss']
})
export class PageAboutUsComponent {
    AcecaNosotros: string;
    carouselOptions = {
        nav: false,
        dots: true,
        responsive: {
            580: {items: 3, margin: 32},
            280: {items: 2, margin: 24},
            0: {items: 1}
        },
        rtl: this.direction.isRTL()
    };

    constructor(
        private direction: DirectionService,
        public pagina: PaginasService
    ) {

        this.pagina.cargarPagina(1).then((resp: any) => {
            this.AcecaNosotros = resp;
            console.log (this.AcecaNosotros);

        })  ;

    }
}

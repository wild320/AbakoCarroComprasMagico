import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { async } from 'rxjs/internal/scheduler/async';
import { StoreService } from 'src/app/shared/services/store.service';
import { DirectionService } from '../../../shared/services/direction.service';

// servicio
import { PaginasService } from '../../../shared/services/paginas.service';

@Component({
    selector: 'app-block-slideshow',
    templateUrl: './block-slideshow.component.html',
    styleUrls: ['./block-slideshow.component.scss']
})
export class BlockSlideshowComponent  {
    @Input() withDepartments = false;

    options;

    slides = [];

    constructor(
        public sanitizer: DomSanitizer,
        private direction: DirectionService,
        public pagina: PaginasService,
        public StoreSvc: StoreService
    ) {

        this.options = {
            nav: false,
            dots: true,
            loop: true,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: false,
            autoplay: true,
            animateIn: 'fadeIn',
            animateOut: 'fadeOut',
            autoplaySpeed: 800,
            autoplayTimeout: 5000,
            navSpeed: 700,
            responsive: {
                0: {items: 1}
            },
            rtl: this.direction.isRTL()
        };
        this. CargarAcordeones();

    }

    private async CargarAcordeones(){

        if (this.slides === undefined || this.slides.length === 0  ){

            await this.pagina.cargarAcordeon().then((resp: any) => {

                this.slides = resp;

            }) ;


        }

    }

}



// slides = [
//    {
//        title: 'Gran variedad de<br>productos',
//        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Etiam pharetra laoreet dui quis molestie.',
//        image_classic: 'assets/images/slides/slide-1.jpg',
//        image_full: 'assets/images/slides/slide-1-full.jpg',
//        image_mobile: 'assets/images/slides/slide-1-mobile.jpg'
//    },
//    {
//        title: 'Combo 1<br>Combos adicionales',
//        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Etiam pharetra laoreet dui quis molestie.',
//        image_classic: 'assets/images/slides/slide-2.jpg',
//        image_full: 'assets/images/slides/slide-2-full.jpg',
//        image_mobile: 'assets/images/slides/slide-2-mobile.jpg'
//    },
//    {
//        title: 'Un Productos<br>Unico Para usted',
//        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br>Etiam pharetra laoreet dui quis molestie.',
//        image_classic: 'assets/images/slides/slide-3.jpg',
//        image_full: 'assets/images/slides/slide-3-full.jpg',
//        image_mobile: 'assets/images/slides/slide-3-mobile.jpg'
//    }
// ];


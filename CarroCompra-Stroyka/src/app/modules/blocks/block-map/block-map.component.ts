import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Servicio
import {StoreService} from '../../../shared/services/store.service';

@Component({
    selector: 'app-block-map',
    templateUrl: './block-map.component.html',
    styleUrls: ['./block-map.component.scss']
})
export class BlockMapComponent {

    frameMap: string;
    sanitizeHtml: SafeHtml;

    constructor(private sanitizer: DomSanitizer,
                private Store: StoreService) {

        this.frameMap = `<iframe src='${this.Store.configuracionSitio.scrmapa}' frameborder='0' scrolling='no' marginheight='0' marginwidth='0'></iframe>`;

        this.sanitizeHtml = this.sanitizer.bypassSecurityTrustHtml(
            this.frameMap
        );


    }
}


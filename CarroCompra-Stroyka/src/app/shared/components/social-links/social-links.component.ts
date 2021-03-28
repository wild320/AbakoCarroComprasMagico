import { Component, HostBinding, Input } from '@angular/core';
import { theme } from '../../../../data/theme';

// Servicio
import {StoreService} from '../../../shared/services/store.service';

// modelos
import {SocialLinksItem} from '../../../../data/modelos/negocio/RedesSociales';


export type SocialLinksShape = 'circle' | 'rounded';

@Component({
    selector: 'app-social-links',
    templateUrl: './social-links.component.html',
    styleUrls: ['./social-links.component.scss']
})
export class SocialLinksComponent {
    theme = theme;

    items: SocialLinksItem[];

    @Input() shape: SocialLinksShape;

    @HostBinding('class.social-links') classSocialLinks = true;

    @HostBinding('class.social-links--shape--circle') get classSocialLinksShapeCircle(): boolean { return this.shape === 'circle'; }

    @HostBinding('class.social-links--shape--rounded') get classSocialLinksShapeRounded(): boolean { return this.shape === 'rounded'; }

    constructor(private Store: StoreService) {

        this.items = this.Store.redes.filter ( rd => rd.url.length > 0 );
    }
}

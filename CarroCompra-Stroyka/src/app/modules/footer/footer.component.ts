import { Component } from '@angular/core';
import { theme } from '../../../data/theme';
import { Link } from '../../shared/interfaces/link';

// servivios
import {StoreService } from '../../shared/services/store.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    theme = theme;
    links: Link[];

    constructor(public storeService: StoreService) {

        const index = this.storeService.navigation.findIndex(x => x.label === 'Sitios');
        const item = 'items';

        this.links =  this.storeService.navigation[index].menu[item];

     }
}

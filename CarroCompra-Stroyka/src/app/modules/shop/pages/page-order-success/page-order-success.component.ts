import { Component } from '@angular/core';
import { Order } from '../../../../shared/interfaces/order';
import { RootService } from '../../../../shared/services/root.service';

@Component({
    selector: 'app-page-order-success',
    templateUrl: './page-order-success.component.html',
    styleUrls: ['./page-order-success.component.scss']
})
export class PageOrderSuccessComponent {
    order: Order ;

    constructor(
        public root: RootService,
    ) { }
}

import { Component, Inject } from '@angular/core';
import { StoreService } from '../../../../shared/services/store.service';
@Component({
    selector: 'app-footer-newsletter',
    templateUrl: './newsletter.component.html',
    styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
    constructor(@Inject(StoreService) public store: StoreService) { }
}

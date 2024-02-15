import { Component } from '@angular/core';
import { StoreService } from 'src/app/shared/services/store.service';
@Component({
    selector: 'app-footer-newsletter',
    templateUrl: './newsletter.component.html',
    styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent {
    constructor(public store: StoreService) { }
}

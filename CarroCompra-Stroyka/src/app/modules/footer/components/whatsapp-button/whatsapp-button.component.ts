import { Component, Inject, OnInit } from '@angular/core';
import { StoreService } from '../../../../shared/services/store.service';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss']
})
export class WhatsappButtonComponent implements OnInit {

  constructor(@Inject(StoreService) public store: StoreService) { }

  ngOnInit(): void {
  }

  openWhatsApp() {
    window.open(`https://api.whatsapp.com/send?phone=${this.store.configuracionSitio.NumeroWpp}`, '_blank');
  }
}

import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/shared/services/store.service';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss']
})
export class WhatsappButtonComponent implements OnInit {

  constructor(public store: StoreService) { }

  ngOnInit(): void {
  }

  openWhatsApp() {
    window.open(`https://api.whatsapp.com/send?phone=${this.store.configuracionSitio.NumeroWpp}`, '_blank');
  }
}

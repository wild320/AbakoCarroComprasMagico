import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { StoreService } from '../../../../shared/services/store.service';
import { isPlatformBrowser } from '@angular/common';
import { WINDOW } from 'src/app/providers/window';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss']
})
export class WhatsappButtonComponent implements OnInit {

  constructor(@Inject(StoreService) public store: StoreService,
    @Inject(PLATFORM_ID) private platformId: Object,

    @Inject(WINDOW) private window: Window | null,) { }

  ngOnInit(): void {
  }

  openWhatsApp() {
    if (isPlatformBrowser(this.platformId)) {
      this.window.open(`https://api.whatsapp.com/send?phone=${this.store.configuracionSitio.NumeroWpp}`, '_blank');
    }
  }
}

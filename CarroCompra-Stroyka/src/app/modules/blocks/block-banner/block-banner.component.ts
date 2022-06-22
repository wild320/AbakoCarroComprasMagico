import { Component } from '@angular/core';
import { BannerService } from 'src/app/shared/services/banner.service';
import { StoreService } from 'src/app/shared/services/store.service';


@Component({
    selector: 'app-block-banner',
    templateUrl: './block-banner.component.html',
    styleUrls: ['./block-banner.component.scss']
})
export class BlockBannerComponent {
   infoBanner

    constructor( public banner: BannerService,
                 public StoreSvc: StoreService) {
      
        this.banner.cargarBanner().then(data => {
        this.infoBanner = data
    })
       
    }
    
}

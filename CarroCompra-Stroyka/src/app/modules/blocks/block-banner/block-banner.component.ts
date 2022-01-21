import { Component } from '@angular/core';
import { BannerService } from 'src/app/shared/services/banner.service';


@Component({
    selector: 'app-block-banner',
    templateUrl: './block-banner.component.html',
    styleUrls: ['./block-banner.component.scss']
})
export class BlockBannerComponent {
   infoBanner

    constructor( public banner: BannerService) {
      
        this.banner.cargarBanner().then(data => {
        this.infoBanner = data
    })
       
    }
    
}

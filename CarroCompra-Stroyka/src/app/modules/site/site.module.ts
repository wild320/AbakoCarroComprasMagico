import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';

// modules (third-party)
import { CarouselModule } from 'ngx-owl-carousel-o';

// modules
import { BlocksModule } from '../blocks/blocks.module';
import { SharedModule } from '../../shared/shared.module';
import { SiteRoutingModule } from './site-routing.module';

// pages
import { PageAboutUsComponent } from './pages/page-about-us/page-about-us.component';
import { PageComponentsComponent } from './pages/page-components/page-components.component';
import { PageContactUsAltComponent } from './pages/page-contact-us-alt/page-contact-us-alt.component';
import { PageContactUsComponent } from './pages/page-contact-us/page-contact-us.component';
import { PageFaqComponent } from './pages/page-faq/page-faq.component';
import { PageTermsComponent } from './pages/page-terms/page-terms.component';
import { PageTypographyComponent } from './pages/page-typography/page-typography.component';
import { PageInfoSendComponent } from './pages/page-info-send/page-info-send.component';
import { PagePrivateComponent } from './pages/page-private/page-private.component';

@NgModule({
    declarations: [
        // pages
        PageAboutUsComponent,
        PageComponentsComponent,
        PageContactUsAltComponent,
        PageContactUsComponent,
        PageFaqComponent,
        PageTermsComponent,
        PageTypographyComponent,
        PageInfoSendComponent,
        PagePrivateComponent
    ],
    imports: [
        // modules (angular)
        CommonModule,
        // modules (third-party)
        CarouselModule,
        // modules
        BlocksModule,
        SharedModule,
        SiteRoutingModule
    ]
})
export class SiteModule { }

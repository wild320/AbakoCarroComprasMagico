import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { DropcartType } from '../../modules/header/components/dropcart/dropcart.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderModule } from 'src/app/modules/header/header.module';
import { MobileModule } from 'src/app/modules/mobile/mobile.module';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'src/app/modules/footer/footer.component';
import { FooterModule } from 'src/app/modules/footer/footer.module';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [SharedModule, HeaderModule, MobileModule, RouterModule, CommonModule, RouterLink, RouterOutlet, FooterModule],
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent {
    headerLayout: 'classic'|'compact';
    dropcartType: DropcartType;

    constructor(
        public route: ActivatedRoute
    ) {
        this.route.data.subscribe(data => {
            this.headerLayout = data['headerLayout'];
            this.dropcartType = data['dropcartType'] || 'dropdown';
        });
    }
}

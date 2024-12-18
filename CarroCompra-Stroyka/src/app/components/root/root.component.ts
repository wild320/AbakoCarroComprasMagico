import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { FooterModule } from 'src/app/modules/footer/footer.module';
import { HeaderModule } from 'src/app/modules/header/header.module';
import { MobileModule } from 'src/app/modules/mobile/mobile.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropcartType } from '../../modules/header/components/dropcart/dropcart.component';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [SharedModule, HeaderModule, MobileModule, RouterModule, CommonModule, RouterOutlet, FooterModule],
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

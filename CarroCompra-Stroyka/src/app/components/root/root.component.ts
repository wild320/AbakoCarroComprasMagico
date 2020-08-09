import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DropcartType } from '../../modules/header/components/dropcart/dropcart.component';

@Component({
    selector: 'app-main',
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
            this.headerLayout = data.headerLayout;
            this.dropcartType = data.dropcartType || 'dropdown';
        });
    }
}

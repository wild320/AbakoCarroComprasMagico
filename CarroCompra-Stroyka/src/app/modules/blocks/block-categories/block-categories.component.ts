import { Component, Input } from '@angular/core';
import { Category } from '../../../shared/interfaces/category';
import { RootService } from '../../../shared/services/root.service';

// constantes
import {Crutas } from '../../../../data/contantes/cRutas';

@Component({
    selector: 'app-block-categories',
    templateUrl: './block-categories.component.html',
    styleUrls: ['./block-categories.component.scss']
})
export class BlockCategoriesComponent {
    @Input() header = '';
    @Input() layout: 'classic'|'compact' = 'classic';
    @Input() categories: Category[] = [];

    RutaShop: string;

    constructor(
        public root: RootService,
    ) {
        this.RutaShop = Crutas.shop;
    }
}

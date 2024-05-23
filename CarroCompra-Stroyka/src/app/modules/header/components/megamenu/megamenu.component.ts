import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Megamenu } from '../../../../shared/interfaces/megamenu';
import { NestedLink } from '../../../../shared/interfaces/nested-link';

// constantes
import { Crutas } from '../../../../../data/contantes/cRutas';

@Component({
    selector: 'app-header-megamenu',
    templateUrl: './megamenu.component.html',
    styleUrls: ['./megamenu.component.scss']
})
export class MegamenuComponent implements OnInit  {
    @Input() menu: Megamenu;

    @Output() itemClick: EventEmitter<NestedLink> = new EventEmitter<NestedLink>();

    RutaShop: string;

    constructor() {

        this.RutaShop = Crutas.shop;
    }

    ngOnInit(): void {
        if (this.menu && this.menu.columns[0].items) {
            this.sortItems(this.menu.columns[0].items);
        }
    }

    sortItems(items: NestedLink[]): void {
        items.sort((a, b) => a.label.localeCompare(b.label));
        items.forEach(item => {
            if (item.items) {
                this.sortItems(item.items);
            }
        });
    }
}

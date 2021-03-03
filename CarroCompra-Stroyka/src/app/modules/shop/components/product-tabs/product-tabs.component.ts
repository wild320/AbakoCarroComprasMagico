import { Component, Input } from '@angular/core';
import { ProductFeaturesSection} from '../../../../shared/interfaces/product';
import { specification } from '../../../../../data/shop-product-spec';
import { reviews } from '../../../../../data/shop-product-reviews';
import { Review } from '../../../../shared/interfaces/review';


// modelos
import { Item } from '../../../../../data/modelos/articulos/Items';

@Component({
    selector: 'app-product-tabs',
    templateUrl: './product-tabs.component.html',
    styleUrls: ['./product-tabs.component.scss']
})
export class ProductTabsComponent {
    @Input() withSidebar = false;
    @Input() tab: 'description'|'specification'|'reviews' = 'description';
    @Input() product: Item;

    specification: ProductFeaturesSection[] = specification;
    reviews: Review[] = reviews;

    constructor() { }
}

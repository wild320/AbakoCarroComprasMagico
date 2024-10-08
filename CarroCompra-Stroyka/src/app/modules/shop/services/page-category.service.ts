
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ListOptions } from '../../../shared/api/shop.service';


// modelos
import { Products} from '../../../../data/modelos/articulos/DetalleArticulos';
import { Item} from '../../../../data/modelos/articulos/Items';
import { filterValues} from '../../../../data/modelos/articulos/filterValues';
import { Filters } from 'src/data/modelos/articulos/Filters';


/**
 * This service serves as a mediator between the PageCategoryComponent, ProductsViewComponent and WidgetFiltersComponent components.
 */
@Injectable()
export class PageCategoryService {

    // list
    private listState: Products;
    private listSource: BehaviorSubject<Products>;

    list$: Observable<Products>;

    // options
    private optionsState: ListOptions = {};

    get options(): ListOptions {
        return this.optionsState;
    }

    constructor( ) {

        this.listSource = new BehaviorSubject<Products>(this.listState);

        this.list$ = this.listSource.pipe(filter(x => x !== null));

    }

    optionsChange$: EventEmitter<ListOptions> = new EventEmitter<ListOptions>();

    // getters for list
    get items(): Item[] { return this.listState.items; }
    get total(): number { return this.listState.total; }
    get pages(): number { return this.listState.pages; }
    get from(): number { return this.listState.from; }
    get to(): number { return this.listState.to; }
    get filters(): Filters[] { return this.listState.filters; }
    get filterValues(): filterValues[] { return this.listState.filterValues; }


    setList(list: Products): void {
        this.listState = list;
        this.listSource.next(this.listState);
    }



}

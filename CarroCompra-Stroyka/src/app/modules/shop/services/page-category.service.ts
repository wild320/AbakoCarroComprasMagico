import { EventEmitter, Injectable } from '@angular/core';
import { ProductsList } from '../../../shared/interfaces/list';
import { Product } from '../../../shared/interfaces/product';
import { Filter, SerializedFilterValues } from '../../../shared/interfaces/filter';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ListOptions } from '../../../shared/api/shop.service';

/**
 * This service serves as a mediator between the PageCategoryComponent, ProductsViewComponent and WidgetFiltersComponent components.
 */
@Injectable()
export class PageCategoryService {
    // isLoading
    private isLoadingState = false;
    private isLoadingSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoadingState);

    isLoading$: Observable<boolean> = this.isLoadingSource.asObservable();

    // list
    private listState: ProductsList;
    private listSource: BehaviorSubject<ProductsList> = new BehaviorSubject<ProductsList>(this.listState);

    list$: Observable<ProductsList> = this.listSource.pipe(filter(x => x !== null));

    // options
    private optionsState: ListOptions = {};

    get options(): ListOptions {
        return this.optionsState;
    }

    optionsChange$: EventEmitter<ListOptions> = new EventEmitter<ListOptions>();

    // getters for list
    get items(): Product[] { return this.listState.items; }
    get page(): number { return this.listState.page; }
    get limit(): number { return this.listState.limit; }
    get sort(): string { return this.listState.sort; }
    get total(): number { return this.listState.total; }
    get pages(): number { return this.listState.pages; }
    get from(): number { return this.listState.from; }
    get to(): number { return this.listState.to; }
    get filters(): Filter[] { return this.listState.filters; }
    get filterValues(): SerializedFilterValues { return this.listState.filterValues; }

    // set functions
    setIsLoading(value: boolean): void {
        this.isLoadingState = value;
        this.isLoadingSource.next(value);
    }

    setList(list: ProductsList): void {
        this.listState = list;
        this.listSource.next(this.listState);
    }

    setOptions(options: ListOptions, emitEvent: boolean = true): void {
        const diff = this.optionsDiff(options);

        if ('limit' in diff || 'sort' in diff || 'filterValues' in diff) {
            options.page = 1;
        }

        this.optionsState = options;

        if (emitEvent && Object.keys(diff).length > 0) {
            this.optionsChange$.emit(diff);
        }
    }

    updateOptions(options: ListOptions, emitEvent: boolean = true): void {
        this.setOptions({...this.optionsState, ...options}, emitEvent);
    }

    /**
     * Returns only different options.
     */
    protected optionsDiff(curr: ListOptions): ListOptions {
        const result: ListOptions = {};

        ['page', 'limit', 'sort'].forEach(key => {
            if (key in curr && this[key] !== curr[key]) {
                result[key] = curr[key];
            }
        });

        if ('filterValues' in curr) {
            const filterValues = curr.filterValues;

            if (Object.keys(filterValues).length !== Object.keys(this.filterValues).length) {
                result.filterValues = {};
            }

            Object.keys(filterValues).forEach(key => {
                if (this.filterValues[key] !== filterValues[key]) {
                    if (!('filterValues' in result)) {
                        result.filterValues = {};
                    }

                    result.filterValues[key] = filterValues[key];
                }
            });
        }

        return result;
    }
}

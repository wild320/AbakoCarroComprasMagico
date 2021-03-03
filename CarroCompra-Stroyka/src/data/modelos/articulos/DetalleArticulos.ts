import {Item} from './Items';
import {Filters} from './filters';
import {filterValues} from './filterValues';

export class Products {
    page: number;
    limit: number;
    sort: string;
    total: number;
    pages: number;
    from: number;
    to: number;
    filters: Filters[];
    items: Item[];
    filterValues: filterValues[];

}


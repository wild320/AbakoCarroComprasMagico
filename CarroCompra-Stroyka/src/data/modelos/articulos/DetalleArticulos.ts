import {Item} from './Items';
import {filterValues} from './filterValues';
import { Filters }  from './Filters';

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


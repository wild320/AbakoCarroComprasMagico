import { Product } from './product';

// modelos
import { Item } from 'src/data/modelos/articulos/Items';

export interface CartItem {
    product: Item;
    options: {
        name: string;
        value: string;
    }[];
    quantity: number;
}

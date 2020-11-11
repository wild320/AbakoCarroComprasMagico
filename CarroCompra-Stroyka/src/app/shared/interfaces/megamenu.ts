import { MegamenuColumn } from './megamenu-column';

export interface Megamenu {
    type: 'megamenu';
    image?: string;
    columns: MegamenuColumn[];
}

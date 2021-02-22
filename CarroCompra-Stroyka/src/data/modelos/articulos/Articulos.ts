import {Products} from './DetalleArticulos';

export class ArticulosCarroComprasResponse {
    seleccion: string;
    categorias: Array<{
        id: number;
        type: string;
        name: string;
        slug: string;
        items: number;
    }>;
    breadcrumbs: Array<{

        label: string;
        url: string;
    }>;
    products: Products;

}


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
    products: {
        page: number;
        limit: number;
        sort: string;
        total: number;
        pages: number;
        from: number;
        to: number;
        filters: Array<{
            max: number;
            min: number;
            name: string;
            slug: string;
            type: string;
            value: number[];
            items: Array <{
                id: number;
                name: string;
                slug: string;
                type: string;
                count: number;
            }>;
        }>;
    };

}

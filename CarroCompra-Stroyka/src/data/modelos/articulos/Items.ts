
export class Item {
    id: number;
    name: string;
    availability: string;
    badges: string;
    brand: Array<{
        id: number;
        name: string;
        slug: string;
        imagen: string;
    }>;
    compareAtPrice: number;
    images: string[];
    inventario: number;
    inventarioPedido:number;
    price: number;
    priceunit: number;
    taxes: number;
    discount: number;
    discountPerc: number;
    descUM: string;
    um: string;
    rating: number;
    reviews: number;
    sku: string;
    slug: string;
    idMarca: number;
    marca: string;
    tieneDescuento: string;
    color: string;
    colorhx: string;
    ValorUnidadV: any;
    NombreUnidadV: string;
    urlAmigable: string;
    caracteristicas: string;
    observaciones: string;
    favorito: boolean = false;
    attributes: Array <{
        name: string;
        slug: string;
        featured: boolean;
    }>;

}

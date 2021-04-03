
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
    caracteristicas: string;
    observaciones: string;
    attributes: Array <{
        name: string;
        slug: string;
        featured: boolean;
    }>;

}

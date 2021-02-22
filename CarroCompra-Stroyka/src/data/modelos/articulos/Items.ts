
export class item {
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
    rating: number;
    reviews: number;
    sku: string;
    slug: string;
    idMarca: number;
    marca: string;
    tieneDescuento: string;
    color: string;
    attributes: Array <{
        name: string;
        slug: string;
        featured: boolean;
    }>;

}
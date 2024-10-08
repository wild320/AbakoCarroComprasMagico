export interface ResponseArticuloesRetrieve {
    breadcrumbs: any[];
    products:    Products;
}

export interface Products {
    page:    number;
    limit:   number;
    sort:    string;
    total:   number;
    pages:   number;
    from:    number;
    to:      number;
    filters: Filter[];
    items:   ProductsItem[];
}

export interface Filter {
    name:  string;
    slug:  string;
    type:  string;
    root?: string;
    value: number[];
    items: FilterItem[];
    max?:  number;
    min?:  number;
}

export interface FilterItem {
    id:     number;
    name:   string;
    slug:   string;
    type?:  Type;
    count:  number;
    color?: string;
}

export enum Type {
    Shop = "shop",
}

export interface ProductsItem {
    id:               number;
    name:             string;
    availability:     Availability;
    badges:           Badges;
    brand:            Brand;
    compareAtPrice:   number;
    images:           string[];
    price:            number;
    priceunit:        number;
    taxes:            number;
    discount:         number;
    discountPerc:     number;
    descUM:           string;
    um:               string;
    rating:           number;
    reviews:          number;
    sku:              string;
    slug:             string;
    idMarca:          number;
    marca:            string;
    tieneDescuento:   TieneDescuento;
    color:            string;
    colorhx:          string;
    caracteristicas?: string;
    observaciones?:   Observaciones;
    valorIndividual:  string;
    inventario:       number;
    inventarioPedido: number;
    urlAmigable?:     string;
}

export enum Availability {
    Disponible = "Disponible",
    NoDisponible = "No Disponible",
}

export enum Badges {
    Empty = "",
    MasVendidos = "Mas Vendidos",
    Oferta = "Oferta",
}

export interface Brand {
    id:     number;
    name:   string;
    slug:   string;
    imagen: string;
}

export enum Observaciones {
    AntesComboDeAlimentos = "ANTES COMBO DE ALIMENTOS",
    SinObservaciones = "SIN OBSERVACIONES",
    SinObservación = "SIN OBSERVACIÓN",
}

export enum TieneDescuento {
    No = "No",
    Si = "Si",
}

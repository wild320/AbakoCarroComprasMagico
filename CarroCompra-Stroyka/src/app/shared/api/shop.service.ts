import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../interfaces/category';
import { Brand } from '../interfaces/brand';
import { Product } from '../interfaces/product';
import { ProductsList } from '../interfaces/list';
import { SerializedFilterValues } from '../interfaces/filter';
import { Link } from '../../shared/interfaces/link';
import { RootService } from '../../shared/services/root.service';

import {
    getBestsellers,
    getFeatured,
    getLatestProducts,
    getProduct,
    getRelatedProducts,
    getSpecialOffers,
    getTopRated,
    getShopCategoriesBySlugs,
    getShopCategoriesTree,
    getBrands,
    getProductsList,
} from '../../../fake-server';
import { getSuggestions } from 'src/fake-server/database/products';

// servicios
import { ArticulosService } from '../services/articulos.service';

// Modelos
import {MenuCarroCategoria } from '../../../data/modelos/negocio/MenuCarroCategoria';

// utils
import {UtilsTexto} from 'src/app/shared/utils/UtilsTexto';


export interface ListOptions {
    page?: number;
    limit?: number;
    sort?: string;
    filterValues?: SerializedFilterValues;
}

@Injectable({
    providedIn: 'root'
})
export class ShopService {

    public menuCategorias: MenuCarroCategoria[];
    public linea: MenuCarroCategoria[];
    public categoria: any[];
    public segmento: any[];
    public breadcrumbs: Link[] = [];

    constructor(
        private root: RootService,
        private articulosvc: ArticulosService,
        private utils: UtilsTexto,
    ) {

        this.linea = [];
        this.categoria = [];
        this.segmento = [];

        this.suscribirMenu();

    }

   getCategory(slug: string): Observable<MenuCarroCategoria[]> {

        this.inicializarBreadcrumbs();

        if (this.menuCategorias !== undefined) {

            this.MenuCategoria(slug);
            return of (this.linea);
        }

        return of (this.menuCategorias);

    }

    private inicializarBreadcrumbs() {

        this.breadcrumbs = [
            {label: 'Inicio', url: this.root.home()},
            {label: 'Comprar', url: this.root.shop()},
        ];

    }

    private SetBreadcrumbs(label: string, url: string) {

        this.breadcrumbs.push (
            {label: this.utils.capitalize(label),
            url: `${this.root.shop()}/${url}`},
        );

    }

    suscribirMenu(){

        this.articulosvc.getMenuCategoria().subscribe(menu => {
            this.menuCategorias = menu;
            console.log('cargar menu', menu);
        });
    }

    MenuCategoria(slug: string) {

         // Separar el slug
         const divseleccion  = slug.split('|');
         const seleccion     = divseleccion[0];
         let linea           = '';
         let categoria       = '';
         let segmento        = '';
         let indexlinea;
         let indexcategoria;
         let indexsegmento;

         this.linea = [];

         switch (seleccion) {
             case 'ln':

                linea       = divseleccion[1];
                indexlinea  = this.menuCategorias.findIndex( x => x.id === Number (linea));

                this.linea[0] = this.menuCategorias[indexlinea];

                 // Nombre del item seleccionado
                this.menuCategorias[0].selection = this.linea[0].name;

                console.log('selection', this.menuCategorias[0].selection);

                this.SetBreadcrumbs(this.linea[0].name, `ln|${this.linea[0].id.toString()}`);

                break;

             case 'ct':

                linea       = divseleccion[1];
                categoria   = divseleccion[2];

                indexlinea      = this.menuCategorias.findIndex( x => x.id === Number (linea));
                indexcategoria  = this.menuCategorias[indexlinea].children.findIndex( x => x.id === Number (categoria));

                this.linea[0] = this.menuCategorias[indexlinea];
                this.categoria[0] = this.menuCategorias[indexlinea].children[indexcategoria];

                // Nombre del item seleccionado
                this.menuCategorias[0].selection = this.categoria[0].name;

                console.log('selection', this.menuCategorias[0].selection);

                this.SetBreadcrumbs(this.linea[0].name, `ln|${this.linea[0].id.toString()}`);
                this.SetBreadcrumbs(this.categoria[0].name, `ct|${this.linea[0].id}|${this.categoria[0].id}`);

                break;

             case 'sg':

                linea       = divseleccion[1];
                categoria   = divseleccion[2];
                segmento    = divseleccion[3];

                indexlinea      = this.menuCategorias.findIndex( x => x.id === Number (linea));
                indexcategoria  = this.menuCategorias[indexlinea].children.findIndex( x => x.id === Number (categoria));
                indexsegmento   = this.menuCategorias[indexlinea].children[indexcategoria].children.
                                findIndex( x => x.id === Number (segmento));

                this.linea[0] = this.menuCategorias[indexlinea];
                this.categoria[0] = this.menuCategorias[indexlinea].children[indexcategoria];
                this.segmento[0] = this.menuCategorias[indexlinea].children[indexcategoria].children[indexsegmento];

                // Nombre del item seleccionado
                this.menuCategorias[0].selection = this.segmento[0].name;

                console.log('selection', this.menuCategorias[0].selection);

                this.SetBreadcrumbs(this.linea[0].name, `ln|${this.linea[0].id.toString()}`);
                this.SetBreadcrumbs(this.categoria[0].name, `ct|${this.linea[0].id}|${this.categoria[0].id}`);
                this.SetBreadcrumbs(this.segmento[0].name, `sg|${this.linea[0].id}|${this.categoria[0].id}|${this.segmento[0].id}`);

                break;
        }

    }

    /**
     * Returns a category tree.
     *
     * @param parent - If a parent is specified then its descendants will be returned.
     * @param depth  - Maximum depth of category tree.
     */
    getCategories(parent: Partial<Category> = null, depth: number = 0): Observable<Category[]> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/categories.json?parent=latest-news&depth=1
         *
         * where:
         * - parent = parent.slug
         * - depth  = depth
         */
        // const params: {[param: string]: string} = {
        //     parent: parent.slug,
        //     depth: depth.toString(),
        // };
        //
        // return this.http.get<Category[]>('https://example.com/api/shop/categories.json', {params});

        // This is for demonstration purposes only. Remove it and use the code above.
        return getShopCategoriesTree(parent ? parent.slug : null, depth);
    }

    /**
     * Returns an array of the specified categories.
     *
     * @param slugs - Array of slugs.
     * @param depth - Maximum depth of category tree.
     */
    getCategoriesBySlug(slugs: string[], depth: number = 0): Observable<Category[]> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/categories.json?slugs=power-tools,measurement&depth=1
         *
         * where:
         * - slugs = slugs.join(',')
         * - depth = depth
         */
        // const params: {[param: string]: string} = {
        //     slugs: slugs.join(','),
        //     depth: depth.toString(),
        // };
        //
        // return this.http.get<Category[]>('https://example.com/api/shop/categories.json', {params});

        // This is for demonstration purposes only. Remove it and use the code above.
        return getShopCategoriesBySlugs(slugs, depth);
    }

    /**
     * Returns paginated products list.
     * If categorySlug is null then a list of all products should be returned.
     *
     * @param categorySlug         - Unique human-readable category identifier.
     * @param options              - Options.
     * @param options.page         - Page number (optional).
     * @param options.limit        - Maximum number of items returned at one time (optional).
     * @param options.sort         - The algorithm by which the list should be sorted (optional).
     * @param options.filterValues - An object whose keys are filter slugs and values ​​are filter values (optional).
     */
    getProductsList(categorySlug: string|null, options: ListOptions): Observable<ProductsList> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/products.json?category=screwdriwers&page=2&limit=12&sort=name_desc&filter_price=500-1000
         *
         * where:
         * - category     = categorySlug
         * - page         = options.page
         * - limit        = options.limit
         * - sort         = options.sort
         * - filter_price = options.filterValues.price
         */
        // const params: {[param: string]: string} = {};
        //
        // if (categorySlug) {
        //     params.category = categorySlug;
        // }
        // if ('page' in options) {
        //     params.page = options.page.toString();
        // }
        // if ('limit' in options) {
        //     params.limit = options.limit.toString();
        // }
        // if ('sort' in options) {
        //     params.sort = options.sort;
        // }
        // if ('filterValues' in options) {
        //     Object.keys(options.filterValues).forEach(slug => params[`filter_${slug}`] = options.filterValues[slug]);
        // }
        //
        // return this.http.get<ProductsList>('https://example.com/api/products.json', {params});

        // This is for demonstration purposes only. Remove it and use the code above.
        return getProductsList(categorySlug, options);
    }

    getProduct(productSlug: string): Observable<Product> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/products/electric-planer-brandix-kl370090g-300-watts.json
         *
         * where:
         * - electric-planer-brandix-kl370090g-300-watts = productSlug
         */
        // return this.http.get<Product>(`https://example.com/api/products/${productSlug}.json`);

        // This is for demonstration purposes only. Remove it and use the code above.
        return getProduct(productSlug);
    }

    /**
     * Returns popular brands.
     */
    getPopularBrands(): Observable<Brand[]> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/brands/popular.json
         */
        // return this.http.get<Brand[]>('https://example.com/api/shop/brands/popular.json');

        // This is for demonstration purposes only. Remove it and use the code above.
        return getBrands();
    }

    getBestsellers(limit: number = null): Observable<Product[]> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/products/bestsellers.json?limit=3
         *
         * where:
         * - limit = limit
         */
        // const params: {[param: string]: string} = {};
        //
        // if (limit) {
        //     params.limit = limit.toString();
        // }
        //
        // return this.http.get<Product[]>('https://example.com/api/shop/products/bestsellers.json', {params});

        // This is for demonstration purposes only. Remove it and use the code above.
        return getBestsellers(limit);
    }

    getTopRated(limit: number = null): Observable<Product[]> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/products/top-rated.json?limit=3
         *
         * where:
         * - limit = limit
         */
        // const params: {[param: string]: string} = {};
        //
        // if (limit) {
        //     params.limit = limit.toString();
        // }
        //
        // return this.http.get<Product[]>('https://example.com/api/shop/products/top-rated.json', {params});

        // This is for demonstration purposes only. Remove it and use the code above.
        return getTopRated(limit);
    }

    getSpecialOffers(limit: number = null): Observable<Product[]> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/products/special-offers.json?limit=3
         *
         * where:
         * - limit = limit
         */
        // const params: {[param: string]: string} = {};
        //
        // if (limit) {
        //     params.limit = limit.toString();
        // }
        //
        // return this.http.get<Product[]>('https://example.com/api/shop/products/special-offers.json', {params});

        // This is for demonstration purposes only. Remove it and use the code above.
        return getSpecialOffers(limit);
    }

    getFeaturedProducts(categorySlug: string = null, limit: number = null): Observable<Product[]> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/products/featured.json?category=screwdrivers&limit=3
         *
         * where:
         * - category = categorySlug
         * - limit    = limit
         */
        // const params: {[param: string]: string} = {};
        //
        // if (category) {
        //     params.category = category;
        // }
        // if (limit) {
        //     params.limit = limit.toString();
        // }
        //
        // return this.http.get<Product[]>('https://example.com/api/shop/products/featured.json', {params});

        // This is for demonstration purposes only. Remove it and use the code above.
        return getFeatured(categorySlug, limit);
    }

    getLatestProducts(categorySlug: string = null, limit: number = null): Observable<Product[]> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/products/latest.json?category=screwdrivers&limit=3
         *
         * where:
         * - category = categorySlug
         * - limit    = limit
         */
        // const params: {[param: string]: string} = {};
        //
        // if (category) {
        //     params.category = category;
        // }
        // if (limit) {
        //     params.limit = limit.toString();
        // }
        //
        // return this.http.get<Product[]>('https://example.com/api/shop/products/latest.json', {params});

        // This is for demonstration purposes only. Remove it and use the code above.
        return getLatestProducts(categorySlug, limit);
    }

    getRelatedProducts(product: Partial<Product>): Observable<Product[]> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/shop/products/related.json?for=water-tap
         *
         * where:
         * - for = product.slug
         */
        // const params: {[param: string]: string} = {
        //     for: product.slug,
        // };
        //
        // return this.http.get<Product[]>('https://example.com/api/shop/products/related.json', {params});

        // This is for demonstration purposes only. Remove it and use the code above.
        return getRelatedProducts(product);
    }

    getSuggestions(query: string, limit: number, categorySlug: string = null): Observable<Product[]> {
        /**
         * This is what your API endpoint might look like:
         *
         * https://example.com/api/search/suggestions.json?query=screwdriver&limit=5&category=power-tools
         *
         * where:
         * - query = query
         * - limit = limit
         * - category = categorySlug
         */
        // const params: {[param: string]: string} = {query, limit: limit.toString()};
        //
        // if (categorySlug) {
        //     params.category = categorySlug;
        // }
        //
        // return this.http.get<Product[]>('https://example.com/api/search/suggestions.json', {params});

        // This is for demonstration purposes only. Remove it and use the code above.
        return getSuggestions(query, limit, categorySlug);
    }
}

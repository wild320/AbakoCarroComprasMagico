import { Injectable } from '@angular/core';
import { Brand } from '../interfaces/brand';


@Injectable({
    providedIn: 'root'
})
export class RootService {
    constructor() { }

    home(): string {
        return '/';
    }

    shop(): string {
        return `/shop/catalog`;
    }

    product(id: number,urlAmigable:string): string {

        const basePath = '/shop/products';

        return `${basePath}/${id}/${urlAmigable}`;

    }

    brand(brand: Partial<Brand>): string {
        return '/';
    }

    cart(): string {
        return '/shop/cart';
    }

    checkout(): string {
        return '/shop/cart/checkout';
    }

    wishlist(): string {
        return '/shop/wishlist';
    }

    blog(): string {
        return '/blog';
    }

    post(): string {
        return `/blog/post-classic`;
    }

    login(): string {
        return '/account/login';
    }

    terms(): string {
        return '/site/terms';
    }

    notFound(): string {
        return `/site/not-found`;
    }
}

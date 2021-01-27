import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product';
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

    product(product: Partial<Product>): string {
        const basePath = '/shop/products';

        if ('slug' in product) {
            return `${basePath}/${product.slug}`;
        }
        if ('id' in product) {
            return `${basePath}/${product.id}`;
        }

        throw Error('Provide product with "slug" or "id".');
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

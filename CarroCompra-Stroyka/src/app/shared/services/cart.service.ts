import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
// import { Product } from '../interfaces/product';
import { CartItem } from '../interfaces/cart-item';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

// modelos
import { Item } from 'src/data/modelos/articulos/Items';

interface CartTotal {
    title: string;
    price: number;
    type: 'shipping'|'fee'|'tax'|'other';
}

interface CartData {
    items: CartItem[];
    quantity: number;
    subtotal: number;
    discounts: number;
    totals: CartTotal[];
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private data: CartData = {
        items: [],
        quantity: 0,
        subtotal: 0,
        discounts: 0,
        totals: [],
        total: 0
    };

    private itemsSubject$: BehaviorSubject<CartItem[]> = new BehaviorSubject(this.data.items);
    private quantitySubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.quantity);
    private subtotalSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.subtotal);
    private discountsSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.subtotal);
    private totalsSubject$: BehaviorSubject<CartTotal[]> = new BehaviorSubject(this.data.totals);
    private totalSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.total);
    private onAddingSubject$: Subject<Item> = new Subject();

    get items(): ReadonlyArray<CartItem> {
        return this.data.items;
    }

    get quantity(): number {
        return this.data.quantity;
    }

    readonly items$: Observable<CartItem[]> = this.itemsSubject$.asObservable();
    readonly quantity$: Observable<number> = this.quantitySubject$.asObservable();
    readonly subtotal$: Observable<number> = this.subtotalSubject$.asObservable();
    readonly discounts$: Observable<number> = this.discountsSubject$.asObservable();
    readonly totals$: Observable<CartTotal[]> = this.totalsSubject$.asObservable();
    readonly total$: Observable<number> = this.totalSubject$.asObservable();

    readonly onAdding$: Observable<Item> = this.onAddingSubject$.asObservable();

    constructor(
        @Inject(PLATFORM_ID)
        private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.load();
            this.calc();
        }
    }

    add(product: Item, quantity: number, options: {name: string; value: string}[] = []): Observable<CartItem> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            this.onAddingSubject$.next(product);

            let item = this.items.find(eachItem => {
                if (eachItem.product.id !== product.id || eachItem.options.length !== options.length) {
                    return false;
                }

                if (eachItem.options.length) {
                    for (const option of options) {
                        if (!eachItem.options.find(itemOption => itemOption.name === option.name && itemOption.value === option.value)) {
                            return false;
                        }
                    }
                }

                return true;
            });

            if (item) {
                item.quantity += quantity;
            } else {
                item = {...item,product, quantity, options};

                this.data.items.push(item);
            }

            this.save();
            this.calc();

            return item;
        }));
    }

    update(updates: {item: CartItem, quantity: number}[]): Observable<void> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            updates.forEach(update => {
                const item = this.items.find(eachItem => eachItem === update.item);

                if (item) {
                    item.quantity = update.quantity;
                }
            });

            this.save();
            this.calc();
        }));
    }

    remove(item: CartItem): Observable<void> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            this.data.items = this.data.items.filter(eachItem => eachItem !== item);

            this.save();
            this.calc();
        }));
    }

    // vaciar carro
    clearAll(){

        this.items.map(item => this.remove(item).subscribe());

    }

    private calc(): void {
        let quantity = 0;
        let subtotal = 0;
        let discount = 0;
        let taxes = 0

        this.data.items.forEach(item => {
            quantity += item.quantity;
            subtotal += item.product.priceunit * item.quantity;
            discount += item.product.discount * item.quantity;
            taxes += item.product.taxes * item.quantity;
        });

        const totals: CartTotal[] = [];

        totals.push({
            title: 'Envío',
            price: 0,
            type: 'shipping'
        });
        totals.push({
            title: 'Impuestos',
            price: taxes,
            type: 'tax'
        });

        const total = subtotal - discount + taxes;

        this.data.quantity = quantity;
        this.data.subtotal = subtotal;
        this.data.discounts = discount;
        this.data.totals = totals;
        this.data.total = total;

        this.itemsSubject$.next(this.data.items);
        this.quantitySubject$.next(this.data.quantity);
        this.subtotalSubject$.next(this.data.subtotal);
        this.discountsSubject$.next(this.data.discounts);
        this.totalsSubject$.next(this.data.totals);
        this.totalSubject$.next(this.data.total);
    }

    private save(): void {
        if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('cartItems', JSON.stringify(this.data.items));}
    }

    private load(): void {
        if (isPlatformBrowser(this.platformId)) {
        const items = localStorage.getItem('cartItems');

        if (items) {
            this.data.items = JSON.parse(items);
        }}
    }
}

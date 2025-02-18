import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
// import { Product } from '../interfaces/product';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Item } from '../../../data/modelos/articulos/Items';

// modelos

interface CompareData {
    items: Item[];
}

@Injectable({
    providedIn: 'root'
})
export class CompareService implements OnDestroy {
    private data: CompareData = {
        items: []
    };

    private destroy$: Subject<void> = new Subject();
    private itemsSubject$: BehaviorSubject<Item[]> = new BehaviorSubject([]);
    private onAddingSubject$: Subject<Item> = new Subject();

    readonly items$: Observable<Item[]> = this.itemsSubject$.pipe(takeUntil(this.destroy$));
    readonly onAdding$: Observable<Item> = this.onAddingSubject$.asObservable();

    constructor(
        @Inject(PLATFORM_ID)
        private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.load();
        }
    }

    add(product: Item): Observable<void> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            this.onAddingSubject$.next(product);

            const index = this.data.items.findIndex(item => item.id === product.id);

            if (index === -1) {
                this.data.items.push(product);
                this.save();
            }
        }));
    }

    remove(product: Item): Observable<void> {
        // timer only for demo
        return timer(1000).pipe(map(() => {
            const index = this.data.items.findIndex(item => item.id === product.id);

            if (index !== -1) {
                this.data.items.splice(index, 1);
                this.save();
            }
        }));
    }

    private save(): void {
        localStorage.setItem('compareItems', JSON.stringify(this.data.items));

        this.itemsSubject$.next(this.data.items);
    }

    private load(): void {
        if (isPlatformBrowser(this.platformId)) {
        const items = localStorage.getItem('compareItems');

        if (items) {
            this.data.items = JSON.parse(items);
            this.itemsSubject$.next(this.data.items);
        }}
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

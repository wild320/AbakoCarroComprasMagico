import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShopSidebarService } from '../../services/shop-sidebar.service';
import { PageCategoryService } from '../../services/page-category.service';
import { Link } from '../../../../shared/interfaces/link';
import { of, Subject, timer } from 'rxjs';
import { debounce, mergeMap, takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { parseProductsListParams } from '../../resolvers/products-list-resolver.service';
import { ShopService } from '../../../../shared/api/shop.service';
import { parseFilterValue } from '../../../../shared/helpers/filter';
import { RootService } from '../../../../shared/services/root.service';

// servicios
import { ArticulosService } from '../../../../shared/services/articulos.service';

@Component({
    selector: 'app-grid',
    templateUrl: './page-category.component.html',
    styleUrls: ['./page-category.component.scss'],
    providers: [
        {provide: PageCategoryService, useClass: PageCategoryService},
        {provide: ShopSidebarService, useClass: ShopSidebarService},
    ]
})
export class PageCategoryComponent implements OnInit, OnDestroy {
    destroy$: Subject<void> = new Subject<void>();

    columns: 3|4|5 = 3;
    viewMode: 'grid'|'grid-with-features'|'list' = 'grid';
    sidebarPosition: 'start'|'end' = 'start'; // For LTR scripts "start" is "left" and "end" is "right"
    breadcrumbs: Link[] = [];
    pageHeader: string;

    constructor(
        private router: Router,
        private root: RootService,
        private route: ActivatedRoute,
        private pageService: PageCategoryService,
        private shop: ShopService,
        private location: Location,
        public articulossvc: ArticulosService,
    ) {  }

    ngOnInit(): void {


        this.route.data.subscribe(data => {

            if (this.getCategorySlug() === undefined || !this.getCategorySlug() ){
                this.articulossvc.RecuperarArticulos('nn');
            }else{
                this.articulossvc.RecuperarArticulos(this.getCategorySlug());
            }

            this.articulossvc.getArticulos$().subscribe(articulos => {

                // iniciarlizar SetBreadcrumbs
                this.SetBreadcrumbs(this.articulossvc.getArticulos().breadcrumbs);

                // titulo o marca seleccionado
                this.pageHeader = this.articulossvc.getArticulos().seleccion;


            });

            this.pageService.setList(data.products);

            console.log(data);

            this.columns = 'columns' in data ? data.columns : this.columns;
            this.viewMode = 'viewMode' in data ? data.viewMode : this.viewMode;
            this.sidebarPosition = 'sidebarPosition' in data ? data.sidebarPosition : this.sidebarPosition;

        });

        this.route.queryParams.subscribe(queryParams => {
            this.pageService.setOptions(parseProductsListParams(queryParams), false);
        });

        this.pageService.optionsChange$.pipe(
            debounce(changedOptions => {
                return changedOptions.filterValues ? timer(250) : of(changedOptions);
            }),
            mergeMap(() => {
                this.updateUrl();
                this.pageService.setIsLoading(true);

                return this.shop.getProductsList(
                    this.getCategorySlug(),
                    this.pageService.options,
                ).pipe(
                    takeUntil(this.pageService.optionsChange$)
                );
            }),
            takeUntil(this.destroy$),
        ).subscribe(list => {
            this.pageService.setList(list);
            this.pageService.setIsLoading(false);
        });

    }

    SetBreadcrumbs(breadcrumbs: any[]){

        this.breadcrumbs = this.shop.breadcrumbs;

        // informaciob de la categoria
        if (!this.getCategorySlug()) {
            this.pageHeader = 'Comprar';
        } else {

            try {

                this.shop.SetBreadcrumbs(breadcrumbs);

                this.breadcrumbs = this.shop.breadcrumbs;

                this.validarUrlNOFound(this.getCategorySlug());

            } catch (err) {

                this.router.navigate([this.root.notFound()]).then();

            }

        }

        // recuperar informacion del producto

    }

    validarUrlNOFound(Slug: string ){

        if (this.router.url === this.root.notFound()){
            this.router.navigate([`${this.root.shop()}/${Slug}`]).then();
        }

    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updateUrl(): void {
        const tree = this.router.parseUrl(this.router.url);
        tree.queryParams = this.getQueryParams();
        this.location.replaceState(tree.toString());
    }

    getQueryParams(): Params {
        const params: Params = {};
        const options =  this.pageService.options;
        const filterValues = options.filterValues;

        if ('page' in options && options.page !== 1) {
            params.page = options.page;
        }
        if ('limit' in options && options.limit !== 12) {
            params.limit = options.limit;
        }
        if ('sort' in options && options.sort !== 'default') {
            params.sort = options.sort;
        }
        if ('filterValues' in options) {
            this.pageService.filters.forEach(filter => {
                if (!(filter.slug in filterValues)) {
                    return;
                }

                const filterValue: any = parseFilterValue(filter.type as any, filterValues[filter.slug]);

                switch (filter.type) {
                    case 'range':
                        if (filter.min !== filterValue[0] || filter.max !== filterValue[1]) {
                            params[`filter_${filter.slug}`] = `${filterValue[0]}-${filterValue[1]}`;
                        }
                        break;
                    case 'check':
                    case 'color':
                        if (filterValue.length > 0) {
                            params[`filter_${filter.slug}`] = filterValues[filter.slug];
                        }
                        break;
                    case 'radio':
                        if (filterValue !== filter.items[0].slug) {
                            params[`filter_${filter.slug}`] = filterValue;
                        }
                        break;
                }
            });
        }

        return params;
    }

    getCategorySlug(): string|null {
        return this.route.snapshot.params.label || this.route.snapshot.data.label || null;

    }

}

import { NgModule } from '@angular/core';
import { Routes, RouterModule, Data, ResolveData } from '@angular/router';
import { PageCategoryComponent } from './pages/page-category/page-category.component';
import { PageCartComponent } from './pages/page-cart/page-cart.component';
import { PageWishlistComponent } from './pages/page-wishlist/page-wishlist.component';
import { PageCheckoutComponent } from './pages/page-checkout/page-checkout.component';
import { PageCompareComponent } from './pages/page-compare/page-compare.component';
import { PageTrackOrderComponent } from './pages/page-track-order/page-track-order.component';
import { CheckoutGuard } from './guards/checkout.guard';
import { PageProductComponent } from './pages/page-product/page-product.component';
import { ProductsListResolverService } from './resolvers/products-list-resolver.service';
import { PageOrderSuccessComponent } from './pages/page-order-success/page-order-success.component';
import { appDataResolver } from 'src/app/providers/appData.resolver';
import { productResolver } from './resolvers/product.resolver';

const categoryPageData: Data = {
    // Number of products per row. Possible values: 3, 4, 5.
    columns: 3,
    // Shop view mode by default. Possible values: 'grid', 'grid-with-features', 'list'.
    viewMode: 'grid',
    // Sidebar position. Possible values: 'start', 'end'.
    // It does not matter if the value of the 'columns' parameter is not 3.
    // For LTR scripts "start" is "left" and "end" is "right".
    sidebarPosition: 'start'
};


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'catalog'
    },
    {
        path: 'catalog',
        component: PageCategoryComponent
    },
    {
        path: 'catalog/:label',
        component: PageCategoryComponent,
        data: categoryPageData
    },
    {
        path: 'products/:productSlug/:urlAmigable',
        component: PageProductComponent,
        resolve: {
            appData: appDataResolver,
            product: productResolver
        },
        data: {
            // Product page layout. Possible values: 'standard', 'columnar', 'sidebar'.
            layout: 'standard',
            // Sidebar position. Possible values: 'start', 'end'.
            // It does not matter if the value of the 'layout' parameter is not 'sidebar'.
            // For LTR scripts "start" is "left" and "end" is "right".
            sidebarPosition: 'start'
        },
    },
    {
        path: 'cart',
        pathMatch: 'full',
        component: PageCartComponent
    },
    {
        path: 'cart/checkout',
        component: PageCheckoutComponent,
        canActivate: [CheckoutGuard],
    },
    {
        path: 'cart/checkout/success',
        component: PageOrderSuccessComponent,
    },
    {
        path: 'wishlist',
        component: PageWishlistComponent
    },
    {
        path: 'compare',
        component: PageCompareComponent
    },
    {
        path: 'track-order/:id',
        component: PageTrackOrderComponent
    },

    // --- START ---
    // The following routes are only needed to demonstrate possible layouts of some pages. You can delete them.
    // {
    //     path: 'category-grid-4-columns-full',
    //     component: PageCategoryComponent,
    //     data: {
    //         columns: 4,
    //         viewMode: 'grid',
    //         categorySlug: 'power-tools',
    //     },
    //     resolve: {
    //         products: ProductsListResolverService
    //     },
    // },
    // {
    //     path: 'category-grid-5-columns-full',
    //     component: PageCategoryComponent,
    //     data: {
    //         columns: 5,
    //         viewMode: 'grid',
    //         categorySlug: 'power-tools',
    //     },
    //     resolve: {
    //         products: ProductsListResolverService
    //     },
    // },
    // {
    //     path: 'category-list',
    //     component: PageCategoryComponent,
    //     data: {
    //         columns: 3,
    //         viewMode: 'list',
    //         sidebarPosition: 'start',
    //         categorySlug: 'power-tools',
    //     },
    //     resolve: {
    //         products: ProductsListResolverService
    //     },
    // },
    // {
    //     path: 'category-right-sidebar',
    //     component: PageCategoryComponent,
    //     data: {
    //         columns: 3,
    //         viewMode: 'grid',
    //         sidebarPosition: 'end',
    //         categorySlug: 'power-tools',
    //     },
    //     resolve: {
    //         products: ProductsListResolverService
    //     },
    // },
    // {
    //     path: 'product-standard',
    //     component: PageProductComponent,
    //     data: {
    //         layout: 'standard',
    //         sidebarPosition: 'start',
    //         productSlug: 'brandix-screwdriver-screw1500acc',
    //     }
    // },
    // {
    //     path: 'product-columnar',
    //     component: PageProductComponent,
    //     data: {
    //         layout: 'columnar',
    //         productSlug: 'brandix-screwdriver-screw1500acc',
    //     },
    // },
    // {
    //     path: 'product-sidebar',
    //     component: PageProductComponent,
    //     data: {
    //         layout: 'sidebar',
    //         sidebarPosition: 'start',
    //         productSlug: 'brandix-screwdriver-screw1500acc',
    //     },
    // },
    // --- END ---
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShopRoutingModule { }

import { Routes } from '@angular/router';
import { RootComponent } from './components/root/root.component';
import { PageHomeOneComponent } from './pages/page-home-one/page-home-one.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { appDataResolver } from './providers/appData.resolver';

export const routes: Routes = [
    // START / ONLY_FOR_DEMO_YOU_CAN_DELETE_IT
    // {
    //     path: 'home-two',
    //     component: RootComponent,
    //     data: {
    //         headerLayout: 'compact',
    //         dropcartType: 'dropdown'
    //     },
    //     children: [
    //         {
    //             path: '',
    //             component: PageHomeTwoComponent
    //         }
    //     ],
    // },
    // {
    //     path: 'offcanvas-cart',
    //     component: RootComponent,
    //     data: {
    //         headerLayout: 'classic',
    //         dropcartType: 'offcanvas'
    //     },
    //     children: [
    //         {
    //             path: '',
    //             component: PageOffcanvasCartComponent
    //         }
    //     ],
    // },
    // END / ONLY_FOR_DEMO_YOU_CAN_DELETE_IT
    {
        path: '',
        component: RootComponent,
        data: {
            // Header layout. Choose one of ['classic', 'compact'].
            headerLayout: 'classic',
            // Dropcart type. Choose one of ['dropdown', 'offcanvas'].
            dropcartType: 'dropdown'
        },
        resolve: {
            appData: appDataResolver // Añadir el resolver aquí
        },
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: PageHomeOneComponent
            },
            {
                path: 'shop',
                loadChildren: () => import('./modules/shop/shop.module').then(m => m.ShopModule)
            },
            {
                path: 'blog',
                loadChildren: () => import('./modules/blog/blog.module').then(m => m.BlogModule)
            },
            {
                path: 'account',
                loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule)
            },
            {
                path: 'site',
                loadChildren: () => import('./modules/site/site.module').then(m => m.SiteModule)
            },
            {
                path: '**',
                component: PageNotFoundComponent
            }
        ],
    },
];
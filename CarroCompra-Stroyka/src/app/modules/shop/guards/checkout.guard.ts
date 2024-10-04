import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../../shared/services/cart.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CheckoutGuard   {
    constructor(
        private cart: CartService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this.cart.quantity$.pipe(map(quantity => {
            if (quantity) {
                return true;
            }

            this.router.navigateByUrl('/cart').then();

            return false;
        }));
    }
}

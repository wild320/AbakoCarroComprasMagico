import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { FormControl, Validators } from '@angular/forms';
import { CartItem } from '../../../../shared/interfaces/cart-item';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { RootService } from '../../../../shared/services/root.service';
import { StoreService } from 'src/app/shared/services/store.service';

interface Item {
    cartItem: CartItem;
    quantity: number;
    quantityControl: FormControl;
}

@Component({
    selector: 'app-cart',
    templateUrl: './page-cart.component.html',
    styleUrls: ['./page-cart.component.scss']
})
export class PageCartComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject();

    removedItems: CartItem[] = [];
    items: Item[] = [];
    updating = false;
    disableProceedToPay: boolean = false;

    constructor(
        public root: RootService,
        public cart: CartService,
        public storeSvc: StoreService,
    ) { }

    ngOnInit(): void {
        this.cart.items$.pipe(
          takeUntil(this.destroy$),
          map(cartItems => cartItems.map(cartItem => {
            return {
              cartItem,
              quantity: cartItem.quantity,
              quantityControl: new FormControl(cartItem.quantity, Validators.required),
              quantityError: false, // Inicializar quantityError como falso
              quantityErrorMessage: null
            };
          }))
          // tslint:disable-next-line: deprecation
        ).subscribe(items => {
          this.items = items;
          this.cart.items.forEach(item => {
            this.checkQuantity(item);
          });
        });
      }


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    remove(item: CartItem): void {
        if (this.removedItems.includes(item)) {
            return;
        }

        this.removedItems.push(item);
        // tslint:disable-next-line: deprecation
        // tslint:disable-next-line: deprecation
        this.cart.remove(item).subscribe({complete: () => this.removedItems = this.removedItems.filter(eachItem => eachItem !== item)});
    }


    checkQuantity(item: any) {
      const inventory = item.product.inventario;
      const inventoryRequest = item.product.inventarioPedido;
      const quantity = item.quantity;
      const allowExceedInventory = this.storeSvc.configuracionSitio.SuperarInventario;
  
      if (!allowExceedInventory && quantity > inventory - inventoryRequest) {
          // Verificar si la cantidad solicitada excede el inventario disponible
          item.quantityError = true;
          item.quantityErrorMessage = `Se superó el inventario, disponible: ${inventory - inventoryRequest} unidades`;
          this.disableProceedToPay = true; // Mantener deshabilitado el botón de pago
      } else {
          // La cantidad solicitada es válida o se permite exceder el inventario
          item.quantityError = false;
          item.quantityErrorMessage = null;
          this.disableProceedToPay = !allowExceedInventory; // Si no se permite exceder el inventario, deshabilitar el botón de proceder al pago
      }
  }
  
  



    update(): void {
        this.updating = true;
        this.cart.update(
            this.items
                .filter(item => item.quantityControl.value !== item.quantity)
                .map(item => ({
                    item: item.cartItem,
                    quantity: item.quantityControl.value,
                    quantityError: false, // Inicializar quantityError como falso
                    quantityErrorMessage: null
                }))
        // tslint:disable-next-line: deprecation
        ).subscribe({complete: () => this.updating = false});
    }

    needUpdate(): boolean {
        let needUpdate = false;

        for (const item of this.items) {
            if (!item.quantityControl.valid) {
                return false;
            }

            if (item.quantityControl.value !== item.quantity) {
                needUpdate = true;
            }
        }

        return needUpdate;
    }
}

import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CartService } from '../../../../shared/services/cart.service';
import { CartItem } from '../../../../shared/interfaces/cart-item';
import { RootService } from '../../../../shared/services/root.service';
import { OffcanvasCartService } from '../../../../shared/services/offcanvas-cart.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export type DropcartType = 'dropdown' | 'offcanvas';

@Component({
    selector: 'app-header-dropcart',
    templateUrl: './dropcart.component.html',
    styleUrls: ['./dropcart.component.scss']
})
export class DropcartComponent implements OnInit, OnDestroy {
    removedItems: CartItem[] = [];

    @Input() type: DropcartType = 'dropdown';

    @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

    public islogged: boolean = false;

    private usuarioLogueadoSubscription: Subscription;

    constructor(
        @Inject(PLATFORM_ID)
        private platformId: Object,
        public state: OffcanvasCartService,
        public cart: CartService,
        public root: RootService,        
        public storeSvc: StoreService,
        private usuarioService: UsuarioService
    ) { }

    ngOnInit() {
        // Obtener el estado inicial de inicio de sesión
        this.updateIsLogged();
        if(isPlatformBrowser(this.platformId)){
       // Suscribirse a los cambios en el estado de inicio de sesión
       this.usuarioLogueadoSubscription = this.usuarioService.getEstadoLoguin$().subscribe((value) => {
        this.islogged = value;
    });
        }

 
    }

    ngOnDestroy() {
        // Cancelar la suscripción cuando se destruye el componente
        if (this.usuarioLogueadoSubscription) {
            this.usuarioLogueadoSubscription.unsubscribe();
        }
    }

    updateIsLogged() {
        if (isPlatformBrowser(this.platformId)) {

            // Actualizar el estado de inicio de sesión
            this.islogged = localStorage.getItem("isLogue") === "true";
        }
    }

    remove(item: CartItem): void {
        if (this.removedItems.includes(item)) {
            return;
        }

        this.removedItems.push(item);
        this.cart.remove(item).subscribe({complete: () => this.removedItems = this.removedItems.filter(eachItem => eachItem !== item)});
    }

    close(): void {
        this.state.close();
    }
}

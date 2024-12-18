import { Component, OnInit } from '@angular/core';
import { RootService } from '../../../../shared/services/root.service';
import { Router } from '@angular/router';

// servicios
import { PedidosService } from '../../../../../app/shared/services/pedidos.service';

// constantes
import { Crutas } from '../../../../../data/contantes/cRutas';
import { MatDialog } from '@angular/material/dialog';
import { WompiComponent } from '../wompi/wompi.component';

import { PasarelasPagoService } from 'src/app/shared/services/pasarela-pago.service';

@Component({
  selector: 'app-page-order-success',
  templateUrl: './page-order-success.component.html',
  styleUrls: ['./page-order-success.component.scss']
})
export class PageOrderSuccessComponent implements OnInit {

  constructor(
    public pedidosvc: PedidosService,
    public root: RootService,
    private router: Router,
    private PasarelasPagoService: PasarelasPagoService,
    private dialog: MatDialog,

  ) {

    if (this.pedidosvc.ordenactual === undefined) {
      //this.router.navigate([Crutas.MiHistorial]);
    }

  }


  ngOnInit() {
    if (this.pedidosvc.ordenactual?.metodoPago == 'PSE') {
      this.procesarWompi(this.pedidosvc.ordenactual, this.pedidosvc.ordenactual.total);
    }

  }
  private procesarWompi(pedido: any, amount: number) {
    this.PasarelasPagoService.iniciarPagoPedido(pedido.pedido, amount.toString());

    this.PasarelasPagoService.GetFacturasPreparadas$().subscribe((data) => {
      this.mostrarConfirmacionInicioPago(pedido, data);
    });
  }


  private mostrarConfirmacionInicioPago(pedido: any, wompiParams: any): void {
    // Crear el objeto 'order' con los datos del pedido
    const order = {
      idPedido: pedido.idPedido,
      pedido: pedido.pedido,
      fecha: pedido.fecha,
      total: pedido.total,
      metodoPago: pedido.pasarela,
      estado: pedido.estado,
    };

    // Preparar los parámetros de Wompi
    const wompiParamsConfig = {
      publickey: wompiParams.publickey,
      amountInCents: wompiParams.amountInCents,
      reference: wompiParams.reference,
      signatureintegrity: wompiParams.signatureintegrity,
    };

    // Abrir el modal utilizando MatDialog
    const dialogRef = this.dialog.open(WompiComponent, {
      width: "500px",
      disableClose: true,
      data: {
        order: order,
        wompiParams: wompiParamsConfig,
      },
    });

    // Manejar acciones después de cerrar el modal (opcional)
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("El modal se cerró con datos:", result);
      } else {
        console.log("El modal se cerró sin datos.");
      }
    });
  }
}

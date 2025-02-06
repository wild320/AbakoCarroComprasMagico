import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { WINDOW } from "src/app/providers/window";
import { Order } from "src/app/shared/interfaces/order";

@Component({
  selector: 'app-wompi',
  templateUrl: './wompi.component.html',
  styleUrls: ['./wompi.component.scss'],
})
export class WompiComponent implements OnInit {
  public order: Order;
  public LLAVE_PUBLICA_DEL_COMERCIO: string;
  public MONEDA: string;
  public MONTO_EN_CENTAVOS: number;
  public REFERENCIA_DE_PAGO: string;
  public FIRMA_DE_INTEGRIDAD: string;
  public URL_REDIRECCION: string;

  constructor( 
    @Inject(WINDOW) private window: Window | null,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialogRef: MatDialogRef<WompiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: Order; wompiParams: any; idEmpresa: string; }
  ) {
    const { order, wompiParams } = data || {};
    if (isPlatformBrowser(this.platformId)) {
    if (wompiParams && order) {
      this.LLAVE_PUBLICA_DEL_COMERCIO = wompiParams.publickey;
      this.MONEDA = "COP"; // Moneda en pesos colombianos
      this.MONTO_EN_CENTAVOS = wompiParams.amountInCents;
      this.REFERENCIA_DE_PAGO = wompiParams.reference;
      this.FIRMA_DE_INTEGRIDAD = wompiParams.signatureintegrity;
      this.URL_REDIRECCION = `${this.window.location.origin}/shop/cart/checkout/success`;
      this.order = order;
    }}
  }

  ngOnInit(): void {}

  titleCard() {
    return `Vas a pagar el pedido ${this.REFERENCIA_DE_PAGO}`;
  }

  close(): void {
    this.dialogRef.close();
  }
}

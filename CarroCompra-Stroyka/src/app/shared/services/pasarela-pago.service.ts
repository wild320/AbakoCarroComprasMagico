import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, Subject, tap } from 'rxjs';
import { CServicios } from 'src/data/contantes/cServicios';
import { Mensaje } from 'src/data/modelos/negocio/Mensaje';
import { NegocioService } from './negocio.service';
import { ServiceHelper } from './ServiceHelper';

@Injectable({
    providedIn: 'root'
})
export class PasarelasPagoService {
    private mensaje = new Mensaje();

    private facturasPreparadas$ = new Subject<any>();
    private pagosAsentados$ = new Subject<any>();

    constructor(
        private servicehelper: ServiceHelper<any, any>,
        private negocio: NegocioService,
    ) { }

    /**
     * Inicia el proceso de pago con Wompi.
     * @param reference Referencia de la pedido.
     * @param monto Monto total en formato de string.
     */
    iniciarPagoPedido(reference: number, monto: string): void {
        const amountInCents = parseInt(monto.replace(/,/g, ''), 10) * 100;
        const UsrServicio = `${this.negocio.configuracion.UrlServicioNegocio}${CServicios.ApiNegocio}${CServicios.WompiInicioPago}`;

        const request = {
            Referencia: reference.toString(),
            Monto: `${amountInCents}`,
            Moneda: 'COP',
            redirectUrl: `${window.location.origin}/shop/cart/checkout/success`,
        };

        this.servicehelper.PostData(UsrServicio, request)
            .pipe(
                tap((complemento) => {
                    this.facturasPreparadas$.next({ reference, amountInCents, ...complemento });
                })
            )
            .subscribe();
    }

    /**
     * Observa las facturas preparadas para el pago.
     */
    GetFacturasPreparadas$(): Observable<any> {
        return this.facturasPreparadas$.asObservable();
    }

    /**
     * Observa los pagos asentados.
     */
    GetPagosAsentados$(): Observable<any> {
        return this.pagosAsentados$.asObservable();
    }

    /**
     * Asienta un pago basado en la transacción de Wompi.
     * @param transactionId ID de la transacción de Wompi.
     * @param pedido Número de pedido.
     */
    asentarPago(transactionId: string, pedido: string): void {
        const VerificarServicio = `${this.negocio.configuracion.UrlServicioNegocio}${CServicios.ApiNegocio}${CServicios.WompiVerificar}/${transactionId}`;

        this.servicehelper.getData(VerificarServicio)
            .pipe(
                map((verificacion: any) => {
                    const request = {
                        tipodocumento: 'PDV',
                        documento: pedido,
                        error: 0,
                        idestado: '0',
                        estado: verificacion.data.status,
                        detalleerror: '',
                        ticketid: '',
                        codigoTransaccion: transactionId,
                        banco: ''
                    };

                    if (verificacion.error) {
                        request.error = -1;
                        request.detalleerror = verificacion.error.reason;
                    }

                    return request;
                }),
                catchError(this.logError('Error al verificar transacción'))
            )
            .subscribe((request) => {
                const UsrServicio = `${this.negocio.configuracion.UrlServicioNegocio}${CServicios.ApiNegocio}${CServicios.WompiAsentar}`;

                this.servicehelper.PostData(UsrServicio, request).subscribe(
                    (complemento) => {
                        this.pagosAsentados$.next(complemento);
                    },
                    () => { } // El error ya fue manejado por `logError`.
                );
            });
    }

    /**
     * Centraliza el manejo de errores con un mensaje personalizado.
     * @param message Mensaje de error a mostrar.
     */
    private logError(message: string) {
        return (error: any) => {
            console.error(`${message}: ${JSON.stringify(error)}`);
            this.pagosAsentados$.next(`${message}: ${JSON.stringify(error)}`);
            return of(null); // Emitimos `null` para continuar el flujo.
        };
    }
}

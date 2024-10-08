import { Address } from './address';

export interface Order {
    idPedido: number;
    fecha: string;
    pedido: number ;
    estado: string;
    items: Array<{
    urlAmigable?: string;
        id: number,
        codigo: string,
        nombre: string,
        imagen: string,
        options?: Array<{
            label: string;
            value: string;
        }>;
        precio: number,
        cantidad: number,
        total: number,
    }>;
    lineasAdicionales: Array<{
        clave: string,
        valor: number,
    }>;
    cantidadArticulos: number;
    subtotal: number;
    total: number;
    metodoPago: string;
    direccionEnvio: Address;
    direccionPrincipal: Address;
}

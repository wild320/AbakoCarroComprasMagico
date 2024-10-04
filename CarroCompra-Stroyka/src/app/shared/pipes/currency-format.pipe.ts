import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CurrencyService } from '../services/currency.service';

@Pipe({
    name: 'currencyFormat',
    pure: false
})
export class CurrencyFormatPipe implements PipeTransform {
    currencyPipe: CurrencyPipe;

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private service: CurrencyService
    ) {
        this.currencyPipe = new CurrencyPipe(this.locale);
    }

     transform(
        value: any,
        currencyCode?: string,
        display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
        digitsInfo?: string,
        locale?: string
    ): string | null {
        currencyCode = currencyCode || `${this.service.options.code} `;
        display = display || this.service.options.display;
        digitsInfo = digitsInfo || this.service.options.digitsInfo;
        locale = locale || this.service.options.locale;
        return this.currencyPipe.transform(value, 'COP ', display, digitsInfo, locale);
    }
}

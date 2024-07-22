import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentPipe'
})
export class PercentPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }
    const percentage = value * 100;

    // Verifica si el número tiene una parte fraccionaria significativa.
    const formattedPercentage = percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1);

    return formattedPercentage + '%';
  }
}

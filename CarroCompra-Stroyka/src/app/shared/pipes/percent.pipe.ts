import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentPipe'
})
export class PercentPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }
    return (value * 100).toFixed(2) + '%';
  }
}

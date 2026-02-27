import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price-pipe',
})
export class PricePipePipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): string {
    if (value && !/^[A-Za-z]$/.test(value)) {
      let newValue = value.toString().replace(/,/g, '');
      if (!isNaN(newValue)) {
        return (+newValue).toLocaleString('en-US');
      }
    }
    return '';
  }
}

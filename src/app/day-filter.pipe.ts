import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayFilter',
})
export class DayFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter((it) => {
      return it.timestamp
        .split(' ')[2]
        .toLocaleLowerCase()
        .includes(searchText);
    });
  }
}

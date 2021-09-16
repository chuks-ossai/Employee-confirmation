import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

const APP_DATE_DISPLAY_FORMAT = `DD.MMM.YYYY`;
const APP_DATE_FORMAT = `YYYY/M/D`;
const APP_DATE_FORMAT_2 = `YYYY-M-D`;

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: number | Date): string {
    if (value) {
      return moment(value).format(APP_DATE_DISPLAY_FORMAT);
    } else {
      return '---';
    }
  }

}

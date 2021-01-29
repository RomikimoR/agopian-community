import { Pipe, PipeTransform } from '@angular/core';
import {DateTime} from "luxon";

@Pipe({name: 'formatDate'})
export class FormatDatePipe implements PipeTransform {
  transform(value: string): string {
    const dt = DateTime.fromISO( value as string ).toLocal();
    const res = dt.setLocale('fr').toRelative() as string;
    return res;
  }
}
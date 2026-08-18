// moment-jalaali ships no type declarations; model its default export as the
// patched moment() function so calendar.utils.ts can type-check.
declare module 'moment-jalaali' {
  import { Moment } from 'moment';

  export default function moment(
    input?: unknown,
    format?: string,
    strict?: boolean
  ): Moment;
}

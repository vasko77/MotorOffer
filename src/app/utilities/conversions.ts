
export function date2String(date: Date): string {

    if (!date) {
      return undefined;
    }

    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString();
    const dd  = date.getDate().toString();

    const mmChars = mm.split('');
    const ddChars = dd.split('');

    const result = yyyy + '-' + (mmChars[1] ? mm : '0' + mmChars[0]) + '-' + (ddChars[1] ? dd : '0' + ddChars[0]);

    return result;
  }

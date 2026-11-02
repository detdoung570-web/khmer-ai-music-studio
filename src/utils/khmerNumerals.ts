const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

export function toKhmerNumber(num: number | string): string {
  return String(num)
    .split('')
    .map(ch => {
      const parsed = parseInt(ch, 10);
      return !isNaN(parsed) ? khmerDigits[parsed] : ch;
    })
    .join('');
}

export function millisecondsToMinutes(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
  
    const pad = (num: number, size: number = 2) => String(num).padStart(size, '0');
  
    return `${pad(minutes)}:${pad(seconds)}`;
  }
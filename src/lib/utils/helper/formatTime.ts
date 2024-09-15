export function formatTime(milliseconds: number): string {
    // Ensure we're working with an integer
    const totalMilliseconds = Math.floor(milliseconds);
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
    
export function utilGetPlatform() {
  if (!process || !process.platform) {
    return 'UNKNOWN';
  }
  if (/^win/i.test(process.platform)) {
    return 'WINDOWS';
  } else {
    return 'OTHER';
  }
}



export default function getIntervalFromRssi(rssi: number) {
  if (rssi > -30) return 120;
  if (rssi > -40) return 250;
  if (rssi > -50) return 500;
  if (rssi > -60) return 900;
  return 1500;
}
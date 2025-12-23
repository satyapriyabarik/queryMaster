
const COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours

function parseBackendDate(value?: string | null): number | null {
  if (!value) return null;

  // MySQL → ISO safety
  const normalized = value.includes(" ")
    ? value.replace(" ", "T")
    : value;

  const time = new Date(normalized).getTime();
  return isNaN(time) ? null : time;
}

export function getNotifyState(lastNotifiedAt?: string | null) {
  const lastTime = parseBackendDate(lastNotifiedAt);

  if (!lastTime) {
    return {
      canNotify: true,
      remainingMs: 0,
      tooltip: "Notify"
    };
  }

  const now = Date.now();
  const diff = now - lastTime;

  if (diff >= COOLDOWN_MS) {
    return {
      canNotify: true,
      remainingMs: 0,
      tooltip: "Notify"
    };
  }

  const remainingMs = COOLDOWN_MS - diff;

  const totalMinutes = Math.ceil(remainingMs / 60000);
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return {
    canNotify: false,
    remainingMs,
    tooltip:
      hrs > 0
        ? `Try again in ${hrs}h ${mins}m`
        : `Try again in ${mins}m`
  };
}

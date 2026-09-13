export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const status = error?.response?.status;
  const raw = error?.response?.data?.message || error?.response?.data?.error;

  if (typeof raw === 'string') {
    const lower = raw.toLowerCase();
    if (
      status === 400 ||
      status === 409 ||
      lower.includes('stock') ||
      lower.includes('inventory') ||
      lower.includes('insufficient') ||
      lower.includes('available')
    ) {
      if (lower.includes('stock') || lower.includes('inventory') || lower.includes('insufficient')) {
        return 'INVENTORY_CHANGED';
      }
    }
    if (!raw.startsWith('AxiosError') && !raw.includes('status code')) {
      return raw;
    }
  }

  if (status === 401) return 'Your session has expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to perform this action.';
  if (status === 404) return 'The requested record could not be found.';
  if (status >= 500) return fallback;

  return fallback;
}

export const INVENTORY_CHANGED_MESSAGE =
  'Inventory changed. The available quantity has changed since this page was opened. Please refresh and review the latest stock before allocating again.';

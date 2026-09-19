// Order status stages. Kept as one flat list (not a nested workflow) so
// managing it stays exactly as simple as before — still just one dropdown
// per row — just with more specific stages than a plain new/closed.
export const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'printing', label: 'Printing' },
  { value: 'ready', label: 'Ready for pickup' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const STATUS_VALUES = STATUSES.map((s) => s.value);

export const STATUS_LABELS = Object.fromEntries(STATUSES.map((s) => [s.value, s.label]));

// Tailwind classes per stage, shared between the admin table and the
// customer's "My Account" enquiry list so a status always looks the same
// wherever it appears.
export const STATUS_STYLES = {
  new: 'bg-registration/10 text-registration',
  quoted: 'bg-brass/10 text-brass-dark',
  confirmed: 'bg-brass/10 text-brass-dark',
  printing: 'bg-ink/10 text-ink',
  ready: 'bg-ink/10 text-ink',
  delivered: 'bg-green-600/10 text-green-700',
  cancelled: 'bg-ink/8 text-ink/50',
};

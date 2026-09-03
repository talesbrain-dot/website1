// Line-art product illustrations in the site's ink/brass palette. There's
// no product photography yet, so these stand in as consistent, on-brand
// imagery across category cards, the portfolio grid and product pages —
// designed together rather than one-off stock images.

const stroke = { stroke: 'currentColor', strokeWidth: 1.3, fill: 'none', strokeLinejoin: 'round', strokeLinecap: 'round' };

function Frame({ children }) {
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {children}
    </svg>
  );
}

export function CardIcon() {
  return (
    <Frame>
      <rect x="22" y="38" width="76" height="46" rx="4" {...stroke} />
      <rect x="30" y="47" width="18" height="18" rx="2" fill="#C08A2E" opacity="0.85" />
      <line x1="54" y1="50" x2="88" y2="50" {...stroke} />
      <line x1="54" y1="58" x2="80" y2="58" {...stroke} />
      <line x1="30" y1="72" x2="60" y2="72" {...stroke} />
    </Frame>
  );
}

export function SheetIcon() {
  return (
    <Frame>
      <rect x="34" y="18" width="52" height="84" rx="3" {...stroke} />
      <line x1="42" y1="34" x2="78" y2="34" {...stroke} />
      <line x1="42" y1="44" x2="78" y2="44" {...stroke} />
      <line x1="42" y1="54" x2="66" y2="54" {...stroke} />
      <rect x="42" y="64" width="36" height="24" rx="2" fill="#C08A2E" opacity="0.8" />
    </Frame>
  );
}

export function BannerIcon() {
  return (
    <Frame>
      <path d="M40 16 L80 16 L86 100 L74 92 L60 104 L46 92 L34 100 Z" {...stroke} />
      <circle cx="60" cy="42" r="12" fill="#C08A2E" opacity="0.85" />
      <line x1="46" y1="66" x2="74" y2="66" {...stroke} />
      <line x1="48" y1="74" x2="72" y2="74" {...stroke} />
    </Frame>
  );
}

export function BoxIcon() {
  return (
    <Frame>
      <path d="M60 22 L96 38 L96 82 L60 98 L24 82 L24 38 Z" {...stroke} />
      <path d="M24 38 L60 54 L96 38" {...stroke} />
      <line x1="60" y1="54" x2="60" y2="98" {...stroke} />
      <path d="M42 30 L78 46" stroke="#C08A2E" strokeWidth="2" opacity="0.85" />
    </Frame>
  );
}

export function StickerIcon() {
  return (
    <Frame>
      <path d="M60 16 A34 34 0 1 1 26 50 L44 68 Z" {...stroke} />
      <circle cx="60" cy="50" r="12" fill="#C08A2E" opacity="0.85" />
    </Frame>
  );
}

export function BookIcon() {
  return (
    <Frame>
      <path d="M28 26 C40 20 52 20 60 26 C68 20 80 20 92 26 L92 92 C80 86 68 86 60 92 C52 86 40 86 28 92 Z" {...stroke} />
      <line x1="60" y1="26" x2="60" y2="92" {...stroke} />
      <line x1="36" y1="42" x2="52" y2="38" {...stroke} />
      <line x1="68" y1="38" x2="84" y2="42" {...stroke} />
    </Frame>
  );
}

export function StampIcon() {
  return (
    <Frame>
      <rect x="40" y="18" width="40" height="26" rx="3" {...stroke} />
      <path d="M34 44 L86 44 L80 66 L40 66 Z" {...stroke} />
      <rect x="30" y="66" width="60" height="14" rx="2" {...stroke} />
      <ellipse cx="60" cy="94" rx="30" ry="8" fill="#B23A2E" opacity="0.18" />
      <ellipse cx="60" cy="90" rx="26" ry="6" {...stroke} />
    </Frame>
  );
}

export function ApparelIcon() {
  return (
    <Frame>
      <path d="M46 22 L60 32 L74 22 L94 34 L84 50 L76 44 L76 100 L44 100 L44 44 L36 50 L26 34 Z" {...stroke} />
      <circle cx="60" cy="60" r="10" fill="#C08A2E" opacity="0.8" />
    </Frame>
  );
}

export function MugIcon() {
  return (
    <Frame>
      <rect x="30" y="30" width="50" height="56" rx="6" {...stroke} />
      <path d="M80 42 C96 42 96 74 80 74" {...stroke} />
      <path d="M30 30 C46 40 64 40 80 30" fill="#C08A2E" opacity="0.7" stroke="none" />
    </Frame>
  );
}

export function IdCardIcon() {
  return (
    <Frame>
      <rect x="24" y="16" width="72" height="88" rx="6" {...stroke} />
      <circle cx="60" cy="12" r="0" />
      <path d="M52 8 L68 8" strokeWidth="4" stroke="currentColor" strokeLinecap="round" />
      <circle cx="60" cy="42" r="12" fill="#C08A2E" opacity="0.8" />
      <line x1="40" y1="66" x2="80" y2="66" {...stroke} />
      <line x1="40" y1="76" x2="70" y2="76" {...stroke} />
    </Frame>
  );
}

export function BagIcon() {
  return (
    <Frame>
      <path d="M32 40 L88 40 L82 100 L38 100 Z" {...stroke} />
      <path d="M44 40 C44 24 76 24 76 40" {...stroke} />
      <rect x="46" y="56" width="28" height="18" fill="#C08A2E" opacity="0.75" />
    </Frame>
  );
}

export function FrameIcon() {
  return (
    <Frame>
      <rect x="24" y="20" width="72" height="80" rx="3" {...stroke} />
      <rect x="34" y="30" width="52" height="60" rx="2" fill="#C08A2E" opacity="0.15" />
      <rect x="34" y="30" width="52" height="60" rx="2" {...stroke} />
      <circle cx="48" cy="46" r="6" {...stroke} />
      <path d="M34 78 L54 60 L66 72 L86 52" {...stroke} />
    </Frame>
  );
}

export function BadgeIcon() {
  return (
    <Frame>
      <circle cx="60" cy="50" r="30" {...stroke} />
      <circle cx="60" cy="50" r="14" fill="#C08A2E" opacity="0.85" />
      <path d="M46 76 L38 100 L60 90 L82 100 L74 76" {...stroke} />
    </Frame>
  );
}

export function SignageIcon() {
  return (
    <Frame>
      <rect x="18" y="30" width="84" height="40" rx="4" {...stroke} />
      <circle cx="60" cy="50" r="10" fill="#C08A2E" opacity="0.85" />
      <line x1="60" y1="70" x2="60" y2="100" {...stroke} />
      <line x1="46" y1="100" x2="74" y2="100" {...stroke} />
    </Frame>
  );
}

export function GiftIcon() {
  return (
    <Frame>
      <rect x="26" y="46" width="68" height="52" rx="3" {...stroke} />
      <rect x="26" y="46" width="68" height="16" fill="#C08A2E" opacity="0.8" />
      <line x1="60" y1="46" x2="60" y2="98" {...stroke} />
      <path d="M60 46 C48 36 40 24 50 20 C58 18 60 32 60 46 C60 32 62 18 70 20 C80 24 72 36 60 46 Z" {...stroke} />
    </Frame>
  );
}

export const ICONS = {
  card: CardIcon,
  sheet: SheetIcon,
  banner: BannerIcon,
  box: BoxIcon,
  sticker: StickerIcon,
  book: BookIcon,
  stamp: StampIcon,
  apparel: ApparelIcon,
  mug: MugIcon,
  idcard: IdCardIcon,
  bag: BagIcon,
  frame: FrameIcon,
  badge: BadgeIcon,
  signage: SignageIcon,
  gift: GiftIcon,
};

export function ProductIllustration({ icon, className = '' }) {
  const Icon = ICONS[icon] || SheetIcon;
  return (
    <div className={className}>
      <Icon />
    </div>
  );
}

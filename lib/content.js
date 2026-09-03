function slugify(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[()]/g, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function p(name, icon) {
  return { name, icon, slug: slugify(name) };
}

export const categories = [
  {
    slug: 'business-essentials',
    label: 'Business Essentials',
    tagline: 'Professional print for everyday business.',
    description:
      'Cards, letterheads, envelopes, forms and certificates — the print your business runs on, done to a consistent standard.',
    icon: 'card',
    items: [
      p('Visiting Cards', 'card'),
      p('Die-Cut Visiting Cards', 'card'),
      p('Velvet Finish Cards', 'card'),
      p('PVC Cards', 'card'),
      p('Matt Laminated Cards', 'card'),
      p('Gloss Laminated Cards', 'card'),
      p('Embossed & Foil Cards', 'card'),
      p('Letterheads', 'sheet'),
      p('Envelopes', 'sheet'),
      p('Bill & Receipt Books', 'book'),
      p('Slip Books', 'book'),
      p('Certificates', 'frame'),
      p('Office Forms', 'sheet'),
      p('Presentation Folders', 'sheet'),
    ],
  },
  {
    slug: 'marketing',
    label: 'Marketing & Promotion',
    tagline: 'Make your message stand out.',
    description:
      'Brochures, flyers, leaflets and posters built to get picked up, read and remembered.',
    icon: 'sheet',
    items: [
      p('Brochures', 'sheet'),
      p('Flyers & Leaflets', 'sheet'),
      p('Posters', 'sheet'),
      p('Catalogues & Lookbooks', 'book'),
      p('Danglers & Standees', 'signage'),
      p('Promotional Cards', 'card'),
      p('Booklets', 'book'),
      p('Menu Cards', 'sheet'),
      p('Table Tents', 'signage'),
    ],
  },
  {
    slug: 'large-format',
    label: 'Flex & Large Format',
    tagline: 'Big visuals. Clear impact.',
    description:
      'Flex banners, vinyl, sunboard and displays for shopfronts, events and exhibitions.',
    icon: 'banner',
    items: [
      p('Flex Banners', 'banner'),
      p('Vinyl Stickers & Decals', 'sticker'),
      p('Sunboard Cutouts', 'signage'),
      p('Standees', 'signage'),
      p('Backdrops', 'banner'),
      p('Shop Signage', 'signage'),
      p('Canopies & Umbrellas', 'signage'),
      p('Vehicle Branding', 'sticker'),
    ],
  },
  {
    slug: 'packaging',
    label: 'Packaging & Retail',
    tagline: 'Print that travels with your product.',
    description:
      'Boxes, sleeves, labels and bags — packaging built for shelf and shipment.',
    icon: 'box',
    items: [
      p('Packaging Boxes', 'box'),
      p('Food & Cake Boxes', 'box'),
      p('Product Labels', 'sticker'),
      p('Retail & Tote Bags', 'bag'),
      p('Sleeves', 'box'),
      p('Stickers (Half-Cut & Laminated)', 'sticker'),
      p('Hang Tags', 'sticker'),
      p('Courier & Poly Bags', 'bag'),
      p('Packing Tape', 'box'),
    ],
  },
  {
    slug: 'events',
    label: 'Events & Personal',
    tagline: 'For the occasions that matter.',
    description: 'Wedding cards, invitations, photo albums and personalised keepsakes.',
    icon: 'book',
    items: [
      p('Wedding Cards', 'card'),
      p('Invitations', 'card'),
      p('Photo Albums', 'book'),
      p('Photo Frames', 'frame'),
      p('Photo Books', 'book'),
      p('Canvas & Photo Prints', 'frame'),
      p('Personalised Gifting', 'gift'),
    ],
  },
  {
    slug: 'corporate-gifting',
    label: 'Corporate Gifting & Apparel',
    tagline: 'Branded merchandise your team will actually use.',
    description:
      'T-shirts, drinkware, bags and everyday items printed with your logo — for teams, launches and giveaways.',
    icon: 'gift',
    items: [
      p('Custom T-Shirts & Caps', 'apparel'),
      p('Mugs & Drinkware', 'mug'),
      p('Notebooks & Diaries', 'book'),
      p('Backpacks & Bags', 'bag'),
      p('Pens & Keychains', 'gift'),
      p('Gift Hampers', 'gift'),
      p('ATM / Card Pouches', 'card'),
    ],
  },
  {
    slug: 'office-id',
    label: 'Awards, ID & Office',
    tagline: 'The everyday print that keeps an office running.',
    description: 'ID cards, lanyards, awards and the office essentials that rarely make it onto a homepage.',
    icon: 'idcard',
    items: [
      p('ID Cards & Lanyards', 'idcard'),
      p('Rubber & Self-Inking Stamps', 'stamp'),
      p('Awards, Medals & Mementos', 'badge'),
      p('Name Plates', 'signage'),
      p('Wiro & Case-Bound Diaries', 'book'),
      p('Button Badges', 'badge'),
    ],
  },
  {
    slug: 'stamps-misc',
    label: 'Custom & One-Off Jobs',
    tagline: 'Have something specific in mind?',
    description: "Anything that doesn't fit a standard category — custom sizes, materials and finishes.",
    icon: 'stamp',
    items: [
      p('Custom Die-Cuts', 'sticker'),
      p('Special Finishes & Foiling', 'card'),
      p('Sample & Prototype Runs', 'box'),
      p('Bulk & Repeat Print Orders', 'book'),
    ],
  },
];

export function getAllProducts() {
  return categories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      categorySlug: cat.slug,
      categoryLabel: cat.label,
      categoryDescription: cat.description,
    }))
  );
}

export function getProductBySlug(slug) {
  return getAllProducts().find((item) => item.slug === slug) || null;
}

export function getRelatedProducts(product, count = 4) {
  return getAllProducts()
    .filter((item) => item.categorySlug === product.categorySlug && item.slug !== product.slug)
    .slice(0, count);
}

export const portfolioItems = [
  { name: 'Brochures', category: 'Marketing & Promotion', slug: 'brochures', icon: 'sheet' },
  { name: 'Wedding Cards', category: 'Events & Personal', slug: 'wedding-cards', icon: 'card' },
  { name: 'Flex Banners', category: 'Flex & Large Format', slug: 'flex-banners', icon: 'banner' },
  { name: 'Packaging Boxes', category: 'Packaging & Retail', slug: 'packaging-boxes', icon: 'box' },
  { name: 'Certificates', category: 'Business Essentials', slug: 'certificates', icon: 'frame' },
  { name: 'Photo Albums', category: 'Events & Personal', slug: 'photo-albums', icon: 'book' },
  { name: 'Visiting Cards', category: 'Business Essentials', slug: 'visiting-cards', icon: 'card' },
  { name: 'Standees', category: 'Flex & Large Format', slug: 'standees', icon: 'signage' },
  { name: 'Product Labels', category: 'Packaging & Retail', slug: 'product-labels', icon: 'sticker' },
  { name: 'ID Cards & Lanyards', category: 'Awards, ID & Office', slug: 'id-cards-and-lanyards', icon: 'idcard' },
  { name: 'Custom T-Shirts & Caps', category: 'Corporate Gifting & Apparel', slug: 'custom-t-shirts-and-caps', icon: 'apparel' },
  { name: 'Rubber & Self-Inking Stamps', category: 'Awards, ID & Office', slug: 'rubber-and-self-inking-stamps', icon: 'stamp' },
];

export const whyPoints = [
  {
    title: 'Wide catalogue',
    body: 'Business, marketing, publishing, flex, signage, packaging, events and more — under one roof.',
  },
  {
    title: 'Human support',
    body: 'Talk to a local team about your actual print specifications instead of guessing on a checkout form.',
  },
  {
    title: 'Made for custom jobs',
    body: 'Have a requirement that is not listed anywhere? Send the details — we will tell you what is possible.',
  },
  {
    title: 'Straightforward pricing',
    body: 'Share your requirement first. You get a recommendation and a quote suited to the job, not a generic rate card.',
  },
];

export const reviews = [
  {
    name: 'Ankit Verma',
    role: 'Local business owner',
    quote: 'Ordered visiting cards and letterheads together — the print quality matched exactly what we discussed, no surprises at pickup.',
    rating: 5,
  },
  {
    name: 'Priya Rawat',
    role: 'Event planner',
    quote: 'Needed wedding cards on a tight timeline. They were upfront about what was possible and delivered on schedule.',
    rating: 5,
  },
  {
    name: 'Suresh Kandari',
    role: 'Shop owner',
    quote: 'Got flex banners and standees done for a store launch. Colours came out sharp and the sizing was exactly as measured.',
    rating: 4,
  },
];

export const faqs = [
  {
    q: 'How do I get a price for my print job?',
    a: 'Send your requirement through the enquiry form or call us directly with quantity, size and timeline. We quote per job rather than publishing fixed online prices, since paper, finish and quantity all affect cost.',
  },
  {
    q: 'Can I see a proof before the full order is printed?',
    a: 'Yes — for most jobs we share a proof (digital or a physical sample for larger runs) before going to full print, so you can check colours, spelling and layout first.',
  },
  {
    q: 'Do you handle small quantities or only bulk orders?',
    a: 'Both. Many of our products — visiting cards, stamps, certificates — are done in small runs. Large format and packaging jobs typically make more sense at higher quantities, which we can advise on.',
  },
  {
    q: 'What if I don\u2019t have a design ready?',
    a: 'Tell us what you need and any reference you have — we can guide you on layout and finish options even if you don\u2019t have a finished design file yet.',
  },
  {
    q: 'How long does a typical order take?',
    a: 'It depends on the product and quantity. Simple jobs like stamps or basic cards can be same-day to a couple of days; larger or custom jobs need more lead time. Share your deadline in the enquiry and we\u2019ll tell you if it\u2019s workable.',
  },
  {
    q: 'Do you deliver, or is it pickup only?',
    a: 'Most customers collect from the press, and delivery can be arranged for certain jobs depending on quantity and location — ask when you enquire.',
  },
];

export const contactInfo = {
  phone: '7300760078',
  email: 'kambojpress@gmail.com',
  address: 'Near Sunanda Hospital, Shimla Bypass Road, Dehradun, Uttarakhand',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Kamboj+Printing+Press+7XXW%2BJHV%2C+Shimla+Bypass+Rd%2C+near+Sunanda+Hospital%2C+Dehradun',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Kamboj+Printing+Press+7XXW%2BJHV%2C+Shimla+Bypass+Rd%2C+near+Sunanda+Hospital%2C+Dehradun&output=embed',
  whatsapp: 'https://wa.me/917300760078',
  instagram: 'https://www.instagram.com/kambojprintingpress/',
  facebook: 'https://www.facebook.com/kambojprintingpress',
  established: 1996,
};

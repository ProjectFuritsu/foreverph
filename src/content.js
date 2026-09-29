// Everything you'll want to edit lives here: brand, Messenger link,
// packages, FAQ and the sample couples shown in the design previews.

export const brand = {
  name: 'ForeverPH',
  tagline: 'Custom wedding websites & digital invitations PH',
  // Your Facebook Page username (the part after facebook.com/), or the Page
  // ID from facebook.com/profile.php?id=... if the Page has no username.
  messengerUsername: '61595113010562',
  // Linked in the footer, and tells Google this Page and the site are one brand.
  facebookUrl: 'https://www.facebook.com/profile.php?id=61595113010562',
  // A live sample wedding website. Leave empty and the button becomes
  // "Ask for a live demo", which opens Messenger instead.
  sampleSiteUrl: '',
  // Essentials sites live at yournames.<subdomain>
  subdomain: 'foreverph.com',
}

// Pesos per US dollar (28 Sep 2026), for the currency switch above the menu.
// The site fetches today's rate and uses this one only if that fails.
export const usdRate = 62.49

// m.me pre-fills `text` for business Pages; elsewhere the chat just opens empty.
export function messengerUrl(message) {
  const base = `https://m.me/${brand.messengerUsername}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const messages = {
  general: `Hi ${brand.name}! I'd like a wedding website. Our wedding date is `,
  demo: `Hi ${brand.name}! Can I see a live sample wedding website?`,
  package: (name) =>
    `Hi ${brand.name}! I'm interested in the ${name} package. Our wedding date is `,
}

export const guestQuestions = [
  { question: 'What time is the ceremony?', answer: 'Schedule', icon: 'clock' },
  { question: "Where's the reception again?", answer: 'Map & directions', icon: 'pin' },
  { question: "What's the dress code?", answer: 'Wedding details', icon: 'envelope' },
  { question: 'Can I bring a plus-one?', answer: 'RSVP form', icon: 'rsvp' },
  { question: 'Is there parking at the venue?', answer: 'Guest FAQ', icon: 'faq' },
]

export const features = [
  { id: 'details', icon: 'envelope', title: 'Wedding details', text: 'Date, venue, dress code and your love story.' },
  { id: 'map', icon: 'pin', title: 'Map', text: 'One tap to directions for the church and reception.' },
  { id: 'schedule', icon: 'clock', title: 'Schedule', text: 'From ceremony to reception, hour by hour.' },
  { id: 'faq', icon: 'faq', title: 'Guest FAQ', text: 'Parking, plus-ones and gifts, answered once.' },
  { id: 'photos', icon: 'image', title: 'Photos', text: 'Your prenup shots in a beautiful gallery.' },
  { id: 'countdown', icon: 'hourglass', title: 'Countdown', text: 'Days, hours and minutes until “I do.”' },
  {
    id: 'rsvp',
    icon: 'rsvp',
    title: 'RSVP form',
    text: "Know who's coming, what they can eat and when they'll arrive, all in one guest list.",
    tags: ['Dietary needs', 'Allergies', 'Faith', 'Accessibility', 'Arrival time'],
  },
]

// Sample photos are free Pexels images (no attribution needed). Swap in your
// couples' photos anytime, e.g. photo: '/designs/sage.jpg' from public/.
const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=640`

// Colors and fonts match the presets in the WeddingWebsite template.
export const designs = [
  {
    id: 'classic',
    photo: pexels(15283313),
    name: 'Classic Ivory',
    note: 'For church, ballroom and timeless weddings',
    couple: ['Bea', 'Paolo'],
    date: '2027-01-23T15:00',
    venue: 'The Ivory Hall',
    city: 'Quezon City',
    colors: { bg: '#fbf8f3', surface: '#ffffff', text: '#2e2a25', muted: '#766c61', primary: '#a8864f', onPrimary: '#ffffff' },
    fonts: { script: 'Great Vibes', heading: 'Cormorant Garamond' },
  },
  {
    id: 'sage',
    photo: pexels(18807708),
    name: 'Garden Sage',
    note: 'For garden, rustic and outdoor weddings',
    couple: ['Amelia', 'James'],
    date: '2027-02-13T15:00',
    venue: 'The Garden Pavilion',
    city: 'Tagaytay City, Cavite',
    colors: { bg: '#f3f5ef', surface: '#ffffff', text: '#25302a', muted: '#617065', primary: '#7c9473', onPrimary: '#ffffff' },
    fonts: { script: 'Parisienne', heading: 'Playfair Display' },
  },
  {
    id: 'blush',
    photo: pexels(679568),
    name: 'Blush Romance',
    note: 'For soft, floral and romantic weddings',
    couple: ['Isabel', 'Miguel'],
    date: '2027-04-24T15:00',
    venue: 'Casa Alta Garden Pavilion',
    city: 'Tagaytay City, Cavite',
    colors: { bg: '#fcf4f3', surface: '#ffffff', text: '#3b2a2d', muted: '#80646a', primary: '#c98690', onPrimary: '#ffffff' },
    fonts: { script: 'Allura', heading: 'Playfair Display' },
  },
  {
    id: 'midnight',
    photo: pexels(954825),
    name: 'Midnight Gold',
    note: 'For formal, evening and black-tie weddings',
    eyebrow: 'Together with their families',
    couple: ['Sofia', 'Marco'],
    date: '2027-06-19T16:00',
    venue: 'Villa Serena',
    city: 'Makati City',
    colors: { bg: '#0f1b2d', surface: '#172740', text: '#f3eee3', muted: '#a7b2c3', primary: '#d4b26a', onPrimary: '#0f1b2d' },
    fonts: { script: 'Pinyon Script', heading: 'Cinzel' },
  },
  {
    id: 'terracotta',
    photo: pexels(5785060),
    name: 'Terracotta Boho',
    note: 'For beach, boho and destination weddings',
    couple: ['Carla', 'Enzo'],
    date: '2027-03-06T16:00',
    venue: 'Hacienda Solana',
    city: 'San Juan, La Union',
    colors: { bg: '#faf2ea', surface: '#fffdf9', text: '#3a2920', muted: '#80634f', primary: '#c0673e', onPrimary: '#ffffff' },
    fonts: { script: 'Great Vibes', heading: 'DM Serif Display' },
  },
  {
    id: 'minimal',
    photo: pexels(19679440),
    name: 'Modern Minimal',
    note: 'For clean, city and intimate weddings',
    couple: ['Andrea', 'Luis'],
    date: '2027-05-15T15:00',
    venue: 'The Glass House',
    city: 'BGC, Taguig',
    colors: { bg: '#ffffff', surface: '#f5f5f3', text: '#161616', muted: '#666666', primary: '#1f1f1f', onPrimary: '#ffffff' },
    fonts: { script: 'Allura', heading: 'Libre Baskerville' },
  },
]

export const heroDesign = designs.find((d) => d.id === 'blush')

// Each design has its own page to link from posts about it. It opens with
// that design on the phone and gets its own Facebook preview.
export const designPath = (design) => `/designs/${design.id}/`

// The page title and the Facebook / Messenger link preview. The preview
// pictures in public/share/ are made by `npm run share-images`.
export const share = {
  home: {
    title: 'Wedding Websites with RSVP in the Philippines | ForeverPH',
    description:
      'Everything your guests need, in one link: details, map, schedule, photos and RSVP. Ready in 2–3 days, from ₱2,499.',
    imageAlt: 'A ForeverPH wedding website on a phone, next to a new RSVP',
  },
  design: (design) => ({
    title: `${design.name} Wedding Website with RSVP | ForeverPH`,
    description: `${design.note}. Details, map, schedule, photos and RSVP in one link. Ready in 2–3 days, from ₱2,499.`,
    imageAlt: `The ${design.name} wedding website design on a phone`,
  }),
}

export const steps = [
  {
    title: 'Message us',
    text: 'Tell us your wedding date and the package you like. A real person replies, not a bot.',
  },
  {
    title: 'Send your details',
    text: 'Names, venue, schedule and photos. Pay half to start through GCash, Maya or bank transfer.',
  },
  {
    title: 'Review and share',
    text: 'Check your site and ask for changes. Pay the rest, then send your link to every guest.',
  },
]

export const specLabels = [
  'Design',
  'Your link',
  'Domain',
  'Stays online',
  'Changes',
  'Ready in',
  'Payment',
]

export const packages = [
  {
    name: 'Essentials',
    tagline: 'Every feature, on our link.',
    price: '₱2,499',
    specs: [
      'Choose from 6 designs',
      { link: `yournames.${brand.subdomain}` },
      'Free',
      'Until 1 month after your wedding',
      '2 rounds',
      '2–3 days',
      'Half to start, half before launch',
    ],
    cta: 'Choose Essentials',
  },
  {
    name: 'Signature',
    tagline: 'Your own .com for a full year.',
    price: '₱2,499',
    priceNote: '+ domain',
    badge: 'Recommended',
    specs: [
      'Choose from 6 designs',
      { link: 'yournames.com' },
      'Domain price + ₱399 configuration fee',
      '1 year',
      '2 rounds',
      '2–3 days',
      'Half to start, half before launch',
    ],
    cta: 'Choose Signature',
  },
  {
    name: 'Bespoke',
    tagline: 'A design made just for you.',
    pricePrefix: 'from',
    price: '₱12,999',
    priceNote: '+ domain',
    specs: [
      'Made just for you',
      { link: 'yournames.com' },
      'Domain price + ₱399 configuration fee',
      '1 year',
      '3 rounds',
      '2–4 weeks',
      '50% to start, 30% after design approval, 20% before launch',
    ],
    cta: 'Ask about Bespoke',
  },
]

export const included =
  'wedding details, map, schedule, FAQ, photos, countdown, and an RSVP form (dietary needs, allergies, faith, accessibility, arrival time).'

export const faqs = [
  {
    q: 'How fast will our website be ready?',
    a: 'Essentials and Signature are ready 2–3 days after you send your details. Bespoke takes 2–4 weeks because we design it from scratch.',
  },
  {
    q: "What's the difference between Essentials and Signature?",
    a: `Same price and features. Essentials uses our link (yournames.${brand.subdomain}) and stays online until 1 month after your wedding. Signature gets your own domain (yournames.com) and stays online for 1 year.`,
  },
  {
    q: 'How much is a domain?',
    a: "It depends on the name and ending you pick (.com, .ph and others). Tell us the name you want and we'll check the price before you pay. There's also a ₱399 configuration fee to set it up.",
  },
  {
    q: 'How many changes can we ask for?',
    a: 'Essentials and Signature include 2 rounds of changes. Bespoke includes 3.',
  },
  {
    q: 'How long will our website stay online?',
    a: 'Essentials stays live until 1 month after your wedding, and each extra month is ₱199. Signature and Bespoke stay live for 1 year. To keep them longer, renew your domain (domain price + ₱399). When the validity ends, the website goes offline.',
  },
  {
    q: 'How do we pay?',
    a: 'GCash, Maya or bank transfer. For Essentials and Signature, pay half to start and half before launch. For Bespoke, pay 50% to start, 30% after you approve the design and 20% before launch.',
  },
  {
    q: "What happens to our guests' RSVP answers?",
    a: "They're private. Guests can RSVP until your RSVP deadline. We delete the answers 2 months after your website goes offline, so ask us for your guest list before then.",
  },
  {
    q: 'Can guests open it from our printed invitation?',
    a: 'Yes. Ask us about adding a QR code to your printed invitation. Guests scan it and land right on your website.',
  },
  {
    q: 'Do you have discounts?',
    a: 'Referred by a past couple? Get ₱200 off any package. Just mention who referred you when you message us.',
  },
]

import { contactInfo } from '@/lib/content';
import { WhatsAppIcon } from '@/components/icons';

export default function WhatsAppFloat() {
  return (
    <a
      href={contactInfo.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Kamboj Press on WhatsApp"
      className="fixed bottom-6 right-5 z-30 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-ink/20 hover:scale-105 active:scale-95 transition-transform duration-150"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
}

import ContactForm from '@/components/ContactForm';
import { contactInfo } from '@/lib/content';

export const metadata = {
  title: 'Contact | Kamboj Press',
  description: 'Get in touch with Kamboj Press in Dehradun — phone, email, WhatsApp, and directions.',
};

export default function ContactPage() {
  return (
    <section className="max-w-content mx-auto px-5 py-14 grid lg:grid-cols-[0.9fr_1.1fr] gap-14">
      <div>
        <p className="text-sm text-ink/55 mb-2">Contact</p>
        <h1 className="font-display text-4xl text-ink font-medium mb-6 max-w-[16ch]">
          Talk to the press directly.
        </h1>
        <p className="text-ink/70 leading-relaxed mb-8 max-w-[42ch]">
          Call, WhatsApp, or send a message below. For a full print requirement with quantities and
          timelines, the enquiry form will get you a faster, more specific response.
        </p>

        <dl className="space-y-5 mb-10">
          <div className="flex items-start gap-4">
            <span className="reg-mark mt-1.5 shrink-0" />
            <div>
              <dt className="text-xs text-ink/50">Phone</dt>
              <dd><a href={`tel:${contactInfo.phone}`} className="text-ink font-medium">{contactInfo.phone}</a></dd>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="reg-mark mt-1.5 shrink-0" />
            <div>
              <dt className="text-xs text-ink/50">Email</dt>
              <dd><a href={`mailto:${contactInfo.email}`} className="text-ink font-medium">{contactInfo.email}</a></dd>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="reg-mark mt-1.5 shrink-0" />
            <div>
              <dt className="text-xs text-ink/50">Address</dt>
              <dd className="text-ink font-medium max-w-[32ch]">{contactInfo.address}</dd>
            </div>
          </div>
        </dl>

        <div className="flex flex-wrap gap-4 mb-10">
          <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer" className="btn-outline">WhatsApp us</a>
          <a href={contactInfo.mapsUrl} target="_blank" rel="noreferrer" className="btn-outline">Get directions</a>
        </div>

        <div className="crop-frame border border-ink/10 h-[260px] overflow-hidden">
          <span className="crop-tl" /><span className="crop-br" />
          <iframe title="Kamboj Press map" src={contactInfo.mapsEmbedUrl} className="w-full h-full" loading="lazy" />
        </div>
      </div>

      <div className="border border-ink/12 bg-white/40 p-7 sm:p-9">
        <h2 className="font-display text-2xl text-ink font-medium mb-6">Send a message</h2>
        <ContactForm />
      </div>
    </section>
  );
}

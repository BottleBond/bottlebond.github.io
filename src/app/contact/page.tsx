import Section from '@/components/ui/Section';
import ContactForm from '@/components/forms/ContactForm';

export const metadata = {
  title: 'Contact | BottleBond',
  description: 'Get in touch with the BottleBond Podcast team. We\'d love to hear from you.',
};

export default function ContactPage() {
  // In production, this would come from an environment variable
  const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  return (
    <main>
      {/* Page Header */}
      <Section variant="dark" padding="lg">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-cream md:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-cream/80">
            Have a question, suggestion, or want to be a guest on the show?
            We&apos;d love to hear from you. Fill out the form below and we&apos;ll
            get back to you as soon as possible.
          </p>
        </div>
      </Section>

      {/* Contact Form */}
      <Section variant="default" padding="lg">
        <div className="mx-auto max-w-xl">
          <ContactForm accessKey={web3formsKey} />
        </div>
      </Section>

      {/* Alternative Contact Methods */}
      <Section variant="alternate" padding="lg">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center font-serif text-2xl text-deep-brown">
            Other Ways to Connect
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {/* YouTube */}
            <a
              href="https://youtube.com/@bottlebond"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center rounded-lg border border-cream bg-white p-6 text-center transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
              <h3 className="font-medium text-deep-brown">YouTube</h3>
              <p className="mt-1 text-sm text-charcoal/70">Watch & subscribe</p>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/bottlebond"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center rounded-lg border border-cream bg-white p-6 text-center transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600 transition-colors group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-pink-500 group-hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <h3 className="font-medium text-deep-brown">Instagram</h3>
              <p className="mt-1 text-sm text-charcoal/70">Follow us</p>
            </a>

            {/* Email */}
            <a
              href="mailto:hello@bottle.bond"
              className="group flex flex-col items-center rounded-lg border border-cream bg-white p-6 text-center transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-burnt-sienna/10 text-burnt-sienna transition-colors group-hover:bg-burnt-sienna group-hover:text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-deep-brown">Email</h3>
              <p className="mt-1 text-sm text-charcoal/70">hello@bottle.bond</p>
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}

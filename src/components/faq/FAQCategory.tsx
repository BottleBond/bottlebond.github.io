import type { FAQ } from '@/types';
import FAQItem from './FAQItem';

export interface FAQCategoryProps {
  category: string;
  faqs: FAQ[];
}

export default function FAQCategory({ category, faqs }: FAQCategoryProps) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 last:mb-0">
      <h2 className="mb-4 font-serif text-xl text-deep-brown md:text-2xl">
        {category}
      </h2>
      <div className="rounded-lg border border-cream bg-white shadow-sm">
        {faqs.map((faq) => (
          <FAQItem key={faq.id} faq={faq} />
        ))}
      </div>
    </section>
  );
}

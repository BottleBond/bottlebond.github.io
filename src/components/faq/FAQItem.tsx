'use client';

import { useState, useCallback, useId } from 'react';
import type { FAQ } from '@/types';

export interface FAQItemProps {
  faq: FAQ;
  defaultOpen?: boolean;
}

export default function FAQItem({ faq, defaultOpen = false }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const id = useId();
  const headingId = `faq-heading-${id}`;
  const contentId = `faq-content-${id}`;

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  return (
    <div className="border-b border-cream last:border-b-0">
      <h3>
        <button
          id={headingId}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-burnt-sienna focus:outline-none focus:ring-2 focus:ring-burnt-sienna focus:ring-offset-2"
        >
          <span className="pr-4 font-medium text-deep-brown">{faq.question}</span>
          <span
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cream transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          >
            <svg
              className="h-4 w-4 text-charcoal"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        hidden={!isOpen}
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <div className="prose prose-sm max-w-none text-charcoal/80">
          {/* Simple markdown-like rendering for answers */}
          {faq.answer.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

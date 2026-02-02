import type { FAQ, FAQsData, FAQsByCategory, FAQCategory } from '@/types';
import faqsData from '@/content/faqs.json';

const data = faqsData as FAQsData;

/**
 * Get all FAQs
 */
export function getAllFAQs(): FAQ[] {
  return data.faqs.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

/**
 * Get FAQ by ID
 */
export function getFAQById(id: string): FAQ | undefined {
  return data.faqs.find((faq) => faq.id === id);
}

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: FAQCategory | string): FAQ[] {
  return data.faqs
    .filter((faq) => faq.category === category)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

/**
 * Get FAQs grouped by category
 */
export function getFAQsGroupedByCategory(): FAQsByCategory {
  const grouped: FAQsByCategory = {};

  for (const faq of data.faqs) {
    const category = faq.category ?? 'General';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    const categoryArray = grouped[category];
    if (categoryArray) {
      categoryArray.push(faq);
    }
  }

  // Sort FAQs within each category
  for (const category of Object.keys(grouped)) {
    const categoryArray = grouped[category];
    if (categoryArray) {
      categoryArray.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    }
  }

  return grouped;
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  for (const faq of data.faqs) {
    categories.add(faq.category ?? 'General');
  }
  return Array.from(categories);
}

/**
 * Search FAQs by question or answer
 */
export function searchFAQs(query: string): FAQ[] {
  const lowerQuery = query.toLowerCase();
  return data.faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(lowerQuery) ||
      faq.answer.toLowerCase().includes(lowerQuery)
  );
}

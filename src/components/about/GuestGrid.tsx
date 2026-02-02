import type { Person } from '@/types';
import PersonCard from './PersonCard';
import Section from '@/components/ui/Section';

export interface GuestGridProps {
  guests: Person[];
  title?: string;
  description?: string;
  variant?: 'default' | 'alternate' | 'dark';
  emptyMessage?: string;
}

export default function GuestGrid({
  guests,
  title = 'Recurring Guests',
  description,
  variant = 'default',
  emptyMessage = 'No featured guests yet. Stay tuned!',
}: GuestGridProps) {
  return (
    <Section variant={variant} padding="lg">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-2xl text-deep-brown md:text-3xl">{title}</h2>
        {description && (
          <p className="mx-auto mt-2 max-w-xl text-charcoal/70">{description}</p>
        )}
      </div>

      {guests.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guests.map((guest) => (
            <PersonCard key={guest.id} person={guest} variant="compact" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-cream bg-cream/30 p-8 text-center">
          <p className="text-charcoal/70">{emptyMessage}</p>
        </div>
      )}
    </Section>
  );
}

import type { Person } from '@/types';
import PersonCard from './PersonCard';
import Section from '@/components/ui/Section';

export interface HostSectionProps {
  host: Person;
  title?: string;
  variant?: 'default' | 'alternate' | 'dark';
}

export default function HostSection({
  host,
  title = 'About Me',
  variant = 'default',
}: HostSectionProps) {
  return (
    <Section variant={variant} padding="lg">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-2xl text-deep-brown md:text-3xl">{title}</h2>
      </div>
      <div className="mx-auto max-w-4xl">
        <PersonCard person={host} variant="full" />
      </div>
    </Section>
  );
}

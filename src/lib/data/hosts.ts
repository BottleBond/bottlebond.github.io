import type { Person, HostsData, PersonRole } from '@/types';
import hostsData from '@/content/hosts.json';

const data = hostsData as HostsData;

/**
 * Get all hosts (including cohosts)
 */
export function getHosts(): Person[] {
  return data.hosts;
}

/**
 * Get all guests
 */
export function getGuests(): Person[] {
  return data.guests;
}

/**
 * Get primary host
 */
export function getPrimaryHost(): Person | undefined {
  return data.hosts.find((host) => host.role === 'host');
}

/**
 * Get cohost(s)
 */
export function getCohosts(): Person[] {
  return data.hosts.filter((host) => host.role === 'cohost');
}

/**
 * Get person by ID
 */
export function getPersonById(id: string): Person | undefined {
  return [...data.hosts, ...data.guests].find((person) => person.id === id);
}

/**
 * Get featured guests
 */
export function getFeaturedGuests(): Person[] {
  return data.guests
    .filter((guest) => guest.featured)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

/**
 * Get all people sorted by role and order
 */
export function getAllPeople(): Person[] {
  const roleOrder: Record<PersonRole, number> = {
    host: 1,
    cohost: 2,
    guest: 3,
  };

  return [...data.hosts, ...data.guests].sort((a, b) => {
    const roleCompare = roleOrder[a.role] - roleOrder[b.role];
    if (roleCompare !== 0) return roleCompare;
    return (a.order ?? 999) - (b.order ?? 999);
  });
}

/**
 * Get people by role
 */
export function getPeopleByRole(role: PersonRole): Person[] {
  return [...data.hosts, ...data.guests]
    .filter((person) => person.role === role)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

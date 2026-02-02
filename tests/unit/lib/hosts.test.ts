import {
  getHosts,
  getGuests,
  getPrimaryHost,
  getCohosts,
  getPersonById,
  getFeaturedGuests,
  getAllPeople,
  getPeopleByRole,
} from '@/lib/data/hosts';

describe('Hosts Data Functions', () => {
  describe('getHosts', () => {
    it('returns all hosts', () => {
      const hosts = getHosts();
      expect(Array.isArray(hosts)).toBe(true);
      expect(hosts.length).toBeGreaterThan(0);
    });

    it('returns hosts with required fields', () => {
      const hosts = getHosts();
      hosts.forEach((host) => {
        expect(host).toHaveProperty('id');
        expect(host).toHaveProperty('name');
        expect(host).toHaveProperty('role');
        expect(host).toHaveProperty('bio');
        expect(host).toHaveProperty('photoUrl');
      });
    });

    it('only returns hosts (not guests)', () => {
      const hosts = getHosts();
      hosts.forEach((host) => {
        expect(['host', 'cohost']).toContain(host.role);
      });
    });
  });

  describe('getGuests', () => {
    it('returns all guests', () => {
      const guests = getGuests();
      expect(Array.isArray(guests)).toBe(true);
    });

    it('only returns guests', () => {
      const guests = getGuests();
      guests.forEach((guest) => {
        expect(guest.role).toBe('guest');
      });
    });
  });

  describe('getPrimaryHost', () => {
    it('returns the primary host', () => {
      const primaryHost = getPrimaryHost();
      expect(primaryHost).toBeDefined();
      if (primaryHost) {
        expect(primaryHost.role).toBe('host');
      }
    });
  });

  describe('getCohosts', () => {
    it('returns cohosts', () => {
      const cohosts = getCohosts();
      expect(Array.isArray(cohosts)).toBe(true);
      cohosts.forEach((cohost) => {
        expect(cohost.role).toBe('cohost');
      });
    });
  });

  describe('getPersonById', () => {
    it('returns person when found', () => {
      const hosts = getHosts();
      if (hosts.length > 0) {
        const found = getPersonById(hosts[0].id);
        expect(found).toEqual(hosts[0]);
      }
    });

    it('returns undefined when not found', () => {
      const found = getPersonById('non-existent-id');
      expect(found).toBeUndefined();
    });
  });

  describe('getFeaturedGuests', () => {
    it('returns featured guests sorted by order', () => {
      const featured = getFeaturedGuests();
      expect(Array.isArray(featured)).toBe(true);
      featured.forEach((guest) => {
        expect(guest.featured).toBe(true);
      });
    });
  });

  describe('getAllPeople', () => {
    it('returns all people sorted by role and order', () => {
      const all = getAllPeople();
      expect(Array.isArray(all)).toBe(true);
      expect(all.length).toBeGreaterThan(0);

      // Verify hosts come before guests
      let seenGuest = false;
      all.forEach((person) => {
        if (person.role === 'guest') {
          seenGuest = true;
        }
        if (seenGuest && person.role !== 'guest') {
          fail('Hosts should come before guests');
        }
      });
    });
  });

  describe('getPeopleByRole', () => {
    it('returns people filtered by role', () => {
      const hosts = getPeopleByRole('host');
      hosts.forEach((person) => {
        expect(person.role).toBe('host');
      });

      const guests = getPeopleByRole('guest');
      guests.forEach((person) => {
        expect(person.role).toBe('guest');
      });
    });
  });
});

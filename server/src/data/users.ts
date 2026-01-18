import { faker } from '@faker-js/faker';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

const HOBBIES_LIST = [
  'Reading', 'Gaming', 'Cooking', 'Photography', 'Hiking', 'Swimming',
  'Cycling', 'Yoga', 'Painting', 'Music', 'Gardening', 'Dancing',
  'Writing', 'Traveling', 'Fishing', 'Camping', 'Running', 'Chess',
  'Knitting', 'Pottery', 'Woodworking', 'Bird Watching', 'Astronomy',
  'Archery', 'Rock Climbing', 'Surfing', 'Skateboarding', 'Martial Arts'
];

const NATIONALITIES = [
  'American', 'British', 'Canadian', 'Australian', 'German', 'French',
  'Japanese', 'Korean', 'Chinese', 'Indian', 'Brazilian', 'Mexican',
  'Italian', 'Spanish', 'Dutch', 'Swedish', 'Norwegian', 'Danish',
  'Polish', 'Russian', 'Turkish', 'Greek', 'Egyptian', 'South African'
];

function generateUser(): User {
  const hobbyCount = faker.number.int({ min: 2, max: 5 });
  const hobbies = faker.helpers.arrayElements(HOBBIES_LIST, hobbyCount);

  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    age: faker.number.int({ min: 18, max: 80 }),
    nationality: faker.helpers.arrayElement(NATIONALITIES),
    hobbies,
  };
}

export const users: User[] = Array.from({ length: 1000 }, generateUser);

// Get top 20 hobbies by frequency
export function getTopHobbies(): string[] {
  const hobbyCounts = new Map<string, number>();

  users.forEach(user => {
    user.hobbies.forEach(hobby => {
      hobbyCounts.set(hobby, (hobbyCounts.get(hobby) || 0) + 1);
    });
  });

  return Array.from(hobbyCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([hobby]) => hobby);
}

// Get top 20 nationalities by frequency
export function getTopNationalities(): string[] {
  const nationalityCounts = new Map<string, number>();

  users.forEach(user => {
    nationalityCounts.set(user.nationality, (nationalityCounts.get(user.nationality) || 0) + 1);
  });

  return Array.from(nationalityCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([nationality]) => nationality);
}

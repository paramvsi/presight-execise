import { Router } from 'express';
import { faker } from '@faker-js/faker';
import { users } from '../data/users.js';

const router = Router();

function generateUserActivity(userId?: string): string {
  const user = userId ? users.find(u => u.id === userId) : null;

  if (user) {
    const activities = [
      `${user.name} has been actively exploring new opportunities in ${faker.company.buzzNoun()}.`,
      `Recently engaged with ${faker.number.int({ min: 5, max: 50 })} community discussions.`,
      `Shows strong interest in ${user.hobbies.slice(0, 2).join(' and ')}.`,
      `Based in ${user.nationality} region, contributing to local initiatives.`,
      `Profile engagement score trending ${faker.helpers.arrayElement(['upward', 'steadily', 'positively'])} this quarter.`,
      `Last active ${faker.number.int({ min: 1, max: 24 })} hours ago.`,
      `Connected with ${faker.number.int({ min: 10, max: 200 })} other users in the network.`,
      `Participated in ${faker.number.int({ min: 2, max: 15 })} events this month.`,
      `${faker.lorem.paragraph()}`,
      `${faker.lorem.paragraph()}`,
    ];
    return activities.join('\n\n');
  }

  return faker.lorem.paragraphs(8);
}

router.get('/', async (req, res) => {
  const userId = req.query.userId as string | undefined;
  const text = generateUserActivity(userId);

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  for (let i = 0; i < text.length; i++) {
    res.write(text[i]);
    await new Promise(resolve => setTimeout(resolve, faker.number.int({ min: 5, max: 15 })));
  }

  res.end();
});

export default router;

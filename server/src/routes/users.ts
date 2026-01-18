import { Router } from 'express';
import { users, getTopHobbies, getTopNationalities, User } from '../data/users.js';

const router = Router();

// GET /api/users - Paginated users with search/filter
router.get('/', (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = (req.query.search as string)?.toLowerCase() || '';
  const hobbies = req.query.hobbies
    ? (req.query.hobbies as string).split(',').filter(Boolean)
    : [];
  const nationalities = req.query.nationalities
    ? (req.query.nationalities as string).split(',').filter(Boolean)
    : [];

  let filteredUsers = users;

  // Apply search filter
  if (search) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }

  // Apply hobbies filter (user must have at least one of the selected hobbies)
  if (hobbies.length > 0) {
    filteredUsers = filteredUsers.filter(user =>
      user.hobbies.some(hobby => hobbies.includes(hobby))
    );
  }

  // Apply nationalities filter
  if (nationalities.length > 0) {
    filteredUsers = filteredUsers.filter(user =>
      nationalities.includes(user.nationality)
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  res.json({
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit),
      hasMore: endIndex < filteredUsers.length,
    },
  });
});

// GET /api/filters - Get top 20 hobbies and nationalities
router.get('/filters', (_req, res) => {
  res.json({
    hobbies: getTopHobbies(),
    nationalities: getTopNationalities(),
  });
});

export default router;

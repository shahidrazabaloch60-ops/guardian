import { Router } from 'express';
import {
  getAllServices,
  getServiceBySlug,
  getServicesByCategory,
} from '../controllers/serviceController';

const router: Router = Router();

// Public service routes
// GET /services?page=1&limit=10&category=combat&search=fire&sortBy=price&sortOrder=asc
router.get('/', getAllServices);

// GET /services/:slug
router.get('/:slug', getServiceBySlug);

// GET /services/category/:categorySlug
router.get('/category/:categorySlug', getServicesByCategory);

export default router;

import express from 'express';
const router = express.Router();
import { addOrderItems, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems);
// Make sure the /:id route will after the / route
router.route('/:id').get(protect, getOrderById);

export default router;

import express from 'express';
const router = express.Router();
import {
	addOrderItems,
	getMyOrders,
	getOrderById,
	updateOrderToPaid,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
// Make sure the /:id route will after the / route
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;

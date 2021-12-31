import express from 'express';
const router = express.Router();
import {
	addOrderItems,
	getUserOrders,
	getOrderById,
	getAllOrders,
	updateOrderToPaid,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router
	.route('/')
	.post(protect, addOrderItems)
	.get(protect, admin, getAllOrders);
router.route('/userorders').get(protect, getUserOrders);
// Make sure the /:id route will after the / route
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;

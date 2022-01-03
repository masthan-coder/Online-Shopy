import express from 'express';
const router = express.Router();
import {
	addOrderItems,
	getUserOrders,
	getOrderById,
	getAllOrders,
	updateOrderToPaid,
	updateOrderToDelivered,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Pending order routes not documented in POSTMAN
// - addOrderItems
// - updateOrderToPaid
// - updateOrderToDelivered

router
	.route('/')
	.post(protect, addOrderItems)
	.get(protect, admin, getAllOrders);
router.route('/userorders').get(protect, getUserOrders);
// Make sure the /:id route will after the / route
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;

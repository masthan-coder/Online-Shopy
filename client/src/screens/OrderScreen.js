import { useEffect, useState } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
	getOrderDetails,
	payOrder,
	deliverOrder,
} from '../actions/orderActions';
import axios from 'axios';
import {
	ORDER_PAY_RESET,
	ORDER_DELIVER_RESET,
} from '../constants/orderConstants';

const OrderScreen = () => {
	const dispatch = useDispatch();
	const history = useHistory();
	const { orderId } = useParams();

	const { order, loading, error } = useSelector((state) => state.orderDetails);
	const { success: successPay, loading: loadingPay } = useSelector(
		(state) => state.orderPay
	);
	const {
		success: successDeliver,
		loading: loadingDeliver,
		error: errorDeliver,
	} = useSelector((state) => state.orderDeliver);
	const { userInfo } = useSelector((state) => state.userLogin);

	const [sdkReady, setSdkReady] = useState(false);

	if (order) {
		//   Calculate prices
		const addDecimals = (num) => {
			return (Math.round(num * 100) / 100).toFixed(2);
		};
		order.itemsPrice = addDecimals(
			order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
		);
	}

	useEffect(() => {
		if (!userInfo) {
			history.push('/login');
		}
		// Paypal Script
		const addPayPalScript = async () => {
			const { data: clientId } = await axios.get('/api/config/paypal');
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
			script.async = true;
			script.onload = () => {
				setSdkReady(true);
			};
			document.body.appendChild(script);
		};

		if (!order || order._id !== orderId || successPay || successDeliver) {
			// We resetting the orderPayReducer state to get rid from the reload once after payment done
			dispatch({
				type: ORDER_PAY_RESET,
			});
			dispatch({
				type: ORDER_DELIVER_RESET,
			});
			dispatch(getOrderDetails(orderId));
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPayPalScript();
			} else {
				setSdkReady(true);
			}
		}
	}, [dispatch, history, order, orderId, successDeliver, successPay, userInfo]);

	const successPaymentHandler = (paymentResult) => {
		dispatch(payOrder(orderId, paymentResult));
	};

	const deliverHandler = () => {
		dispatch(deliverOrder(order));
	};

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<>
			{order && order._id && (
				<>
					<h1>Order {order._id}</h1>
					<Row>
						<Col md={8}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h2>Shipping</h2>
									<p>
										<strong>Name: </strong> {order.user.name}{' '}
									</p>
									<p>
										{' '}
										<strong>Email: </strong>
										<a href={`mailto:${order.user.email}`}>
											{order.user.email}
										</a>
									</p>
									<p>
										<strong>Address: </strong>
										{order.shippingAddress.address},{' '}
										{order.shippingAddress.city},{' '}
										{order.shippingAddress.postalCode},{' '}
										{order.shippingAddress.country}
									</p>
									{order.isDelivered ? (
										<Message variant='success'>
											Delivered on {order.deliveredAt.substring(0, 10)}
										</Message>
									) : (
										<Message variant='danger'>Not Delivered</Message>
									)}
								</ListGroup.Item>
								<ListGroup.Item>
									<h2>Payment Method</h2>
									<p>
										<strong>Method: </strong>
										{order.paymentMethod}
									</p>
									{order.isPaid ? (
										<Message variant='success'>
											Paid on {order.paidAt.substring(0, 10)}
										</Message>
									) : (
										<Message variant='danger'>Not Paid</Message>
									)}
								</ListGroup.Item>
								<ListGroup.Item>
									<h2>Order Items</h2>
									{order.orderItems.length === 0 ? (
										<Message>Order is empty</Message>
									) : (
										<ListGroup variant='flush'>
											{order.orderItems.map((item, index) => (
												<ListGroup.Item key={index}>
													<Row>
														<Col md={1}>
															<Image
																src={item.image}
																alt={item.name}
																fluid
																rounded
															/>
														</Col>
														<Col>
															<Link to={`/product/${item.product}`}>
																{item.name}
															</Link>
														</Col>
														<Col md={4}>
															{item.qty} x ???{item.price} = ???
															{item.qty * item.price}
														</Col>
													</Row>
												</ListGroup.Item>
											))}
										</ListGroup>
									)}
								</ListGroup.Item>
							</ListGroup>
						</Col>

						<Col md={4}>
							<Card>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<h2>Order Summary</h2>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Items</Col>
											<Col>???{order.itemsPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Shipping</Col>
											<Col>???{order.shippingPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>GST</Col>
											<Col>???{order.taxPrice}</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Total</Col>
											<Col>???{order.totalPrice}</Col>
										</Row>
									</ListGroup.Item>
									{!order.isPaid && (
										<ListGroup.Item>
											{loadingPay && <Loader />}
											{!sdkReady ? (
												<Loader />
											) : (
												<PayPalButton
													amount={order.totalPrice}
													onSuccess={successPaymentHandler}
												/>
											)}
										</ListGroup.Item>
									)}
									{loadingDeliver && <Loader />}
									{errorDeliver && (
										<Message variant='danger'>{errorDeliver}</Message>
									)}
									{userInfo &&
										userInfo.isAdmin &&
										order.isPaid &&
										!order.isDelivered && (
											<ListGroup.Item>
												<Button
													type='button'
													className='btn btn-block w-100'
													onClick={deliverHandler}
												>
													Mark As Delivered
												</Button>
											</ListGroup.Item>
										)}
								</ListGroup>
							</Card>
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default OrderScreen;

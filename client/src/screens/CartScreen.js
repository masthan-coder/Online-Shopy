import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	Row,
	Col,
	ListGroup,
	Image,
	Form,
	Button,
	Card,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';
// import { useQuery } from '../hooks/useQuery';

const CartScreen = ({ match, location, history }) => {
	const dispatch = useDispatch();

	// NOTE: By using Hooks
	// let { id } = useParams();
	// const history = useHistory();
	// let query = useQuery();
	// let hookQty = Number(query.get('qty'));

	const productId = match.params.id;
	const qty = location.search ? Number(location.search.split('=')[1]) : 1;

	const { cartItems } = useSelector((state) => state.cart);
	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		if (productId) {
			dispatch(addToCart(productId, qty));
		}
	}, [dispatch, productId, qty]);

	const handleChange = (e, itemId) => {
		// TODO: The BUG is - after changing qty also if we refresh - the component again show the same data bcz in url qty is previous one -
		// TODO: so we want to update the qty in url also.
		// Temporarily using history hook to solve the bug of refresh
		history.push('/cart');
		dispatch(addToCart(itemId, Number(e.target.value)));
	};

	const removeFromCartHandler = (id) => {
		// TODO: The BUG is - after clicking the delete button also if we refresh - the component again re render with url id -
		// TODO: so we want to update the url also when we click delete.
		// Temporarily using history hook to solve the bug of refresh
		history.push('/cart');
		dispatch(removeFromCart(id));
	};

	const checkoutHandler = () => {
		// history.push('/login?redirect=shipping')
		if (!userInfo || !userInfo._id) {
			history.push('/login');
		} else {
			history.push('/shipping');
		}
	};

	return (
		<Row>
			<Col md={8}>
				<h1>Shopping Cart</h1>
				{cartItems.length === 0 ? (
					<Message>
						Your cart is empty <Link to='/'>Go Back</Link>{' '}
					</Message>
				) : (
					<ListGroup variant='flush'>
						{cartItems.map((item) => (
							<ListGroup.Item key={item.product}>
								<Row>
									<Col md={2}>
										<Image src={item.image} alt={item.name} fluid rounded />
									</Col>
									<Col md={3}>
										<Link to={`/product/${item.product}`}>{item.name}</Link>
									</Col>
									<Col md={2}>???{item.price}</Col>
									<Col md={2}>
										<Form.Control
											as='select'
											value={item.qty}
											onChange={(e) => handleChange(e, item.product)}
										>
											{[...Array(item.countInStock).keys()].map((x) => (
												<option key={x + 1} value={x + 1}>
													{x + 1}
												</option>
											))}
										</Form.Control>
									</Col>
									<Col md={2}>
										<Button
											type='button'
											variant='light'
											onClick={() => removeFromCartHandler(item.product)}
										>
											<i className='fas fa-trash'></i>
										</Button>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Col>
			<Col md={4}>
				<Card>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>
								Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
								items
							</h2>
							???
							{cartItems
								.reduce((acc, item) => acc + item.qty * item.price, 0)
								.toFixed(2)}
						</ListGroup.Item>
						<ListGroup.Item>
							<Button
								type='button'
								className='btn-block  w-100'
								disabled={cartItems.length === 0}
								onClick={checkoutHandler}
							>
								Proceed To Checkout
							</Button>
						</ListGroup.Item>
					</ListGroup>
				</Card>
			</Col>
		</Row>
	);
};

export default CartScreen;

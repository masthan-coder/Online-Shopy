import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { deleteProduct, listProducts } from '../actions/productActions';
import { useHistory } from 'react-router-dom';

const ProductListScreen = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const { loading, error, products } = useSelector(
		(state) => state.productList
	);
	const {
		loading: loadingDelete,
		error: errorDelete,
		success: successDelete,
	} = useSelector((state) => state.productDelete);

	const { userInfo } = useSelector((state) => state.userLogin);

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listProducts());
		} else {
			history.push('/login');
		}
	}, [dispatch, history, userInfo, successDelete]);

	const deleteHandler = (id) => {
		if (window.confirm('Are you sure?')) {
			dispatch(deleteProduct(id));
		}
	};
	const createProductHandler = (product) => {
		// Create a product
	};

	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className='text-right d-block'>
					<Button
						className='ms-auto my-3 d-block'
						onClick={createProductHandler}
					>
						<i className='fas fa-plus'></i> Create Product
					</Button>
				</Col>
			</Row>

			{loadingDelete && <Loader />}
			{errorDelete && <Message variant='danger'>{errorDelete}</Message>}
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>PRICE</th>
							<th>CATEGORY</th>
							<th>BRAND</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product._id}>
								<td>{product._id}</td>
								<td>{product.name}</td>
								<td>₹{product.price}</td>
								<td>{product.category}</td>
								<td>{product.brand}</td>
								<td>
									<LinkContainer to={`/admin/product/${product._id}/edit`}>
										<Button variant='light' className='btn-sm'>
											<i className='fas fa-edit'></i>
										</Button>
									</LinkContainer>
									<Button
										variant='danger'
										className='btn-sm'
										onClick={() => deleteHandler(product._id)}
									>
										<i className='fas fa-trash'></i>
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default ProductListScreen;

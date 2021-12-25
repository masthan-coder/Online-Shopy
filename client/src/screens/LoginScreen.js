import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useQuery } from '../hooks/useQuery';
import { login } from '../actions/userActions';

function LoginScreen() {
	const history = useHistory();
	const dispatch = useDispatch();

	let query = useQuery();
	let redirectRoute = Number(query.get('redirect'));

	const { loading, error, userInfo } = useSelector((state) => state.userLogin);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const redirect = redirectRoute ? redirectRoute : '/';

	useEffect(() => {
		if (userInfo) {
			history.push(redirect);
		}
	}, [history, userInfo, redirect]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(login(email, password));
	};

	return (
		<FormContainer>
			<h1>Sign In</h1>
			{error && <Message variant='danger'>{error}</Message>}
			{loading && <Loader />}
			<Form onSubmit={(e) => submitHandler(e)}>
				<Form.Group controlId='email' className='my-2'>
					<Form.Label>Email Address</Form.Label>
					<Form.Control
						type='email'
						placeholder='Enter email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></Form.Control>
				</Form.Group>
				<Form.Group controlId='password' className='my-2'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						placeholder='Enter password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></Form.Control>
				</Form.Group>

				<Button className='my-2' type='submit' variant='primary'>
					Sign In
				</Button>
			</Form>
			<Row className='my-3'>
				<Col>
					New Customer?{' '}
					<Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
						Register
					</Link>
				</Col>
			</Row>
		</FormContainer>
	);
}

export default LoginScreen;

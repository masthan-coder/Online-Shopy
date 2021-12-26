import { useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';

const PaymentScreen = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const { shippingAddress } = useSelector((state) => state.cart);

	const [paymentMethod, setPaymentMethod] = useState('PayPal');

	if (!shippingAddress) {
		history.push('/shipping');
	}

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod));
		history.push('/placeorder');
	};

	return (
		<FormContainer>
			<CheckoutSteps step1 step2 step3 />
			<h1>Payment Method</h1>
			<Form onSubmit={submitHandler}>
				<Form.Group>
					<Form.Label as='legend'>Select Method</Form.Label>

					<Col>
						<Form.Check
							type='radio'
							label='PayPal or Credit Card'
							id='PayPal'
							name='paymentMethod'
							value='PayPal'
							checked
							onChange={(e) => setPaymentMethod(e.target.value)}
						></Form.Check>
						{/* <Form.Check
							type='radio'
							label='Stripe'
							id='Stripe'
							name='paymentMethod'
							value='Stripe'
							onChange={(e) => setPaymentMethod(e.target.value)}
						></Form.Check> */}
					</Col>
				</Form.Group>
				<Button type='submit' variant='primary' className='my-2'>
					Continue
				</Button>
			</Form>
		</FormContainer>
	);
};

export default PaymentScreen;

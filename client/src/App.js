import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Footer from './components/Footer';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import BannerCard from './components/Hero/BannerCard';

function App() {
	return (
		<Router>
			<Header />
			<Route path='/' component={BannerCard} exact />
			<main className='py-3'>
				<Container>
					<Route path='/' component={HomeScreen} exact />
					<Route path='/product/:id' component={ProductScreen} />
				</Container>
			</main>
			<Footer />
		</Router>
	);
}

export default App;

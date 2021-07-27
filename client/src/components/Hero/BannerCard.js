import React from 'react';
import Carousel from 'react-multi-carousel';
import { Card, CardActionArea, CardMedia } from '@material-ui/core';

import useStyles from './styles';

const data = [
	{ img: 'https://source.unsplash.com/random', title: 'events' },
	{ img: 'https://source.unsplash.com/random', title: 'aset' },
	{ img: 'https://source.unsplash.com/random', title: 'conferences' },
	{ img: 'https://source.unsplash.com/random', title: 'institue' },
	{ img: 'https://source.unsplash.com/random', title: 'workshop' },
	{ img: 'https://source.unsplash.com/random', title: 'events' },
];

const responsive = {
	superLargeDesktop: {
		// the naming can be any, depends on you.
		breakpoint: { max: 3000, min: 1200 },
		items: 2,
	},
	desktop: {
		breakpoint: { max: 1200, min: 1024 },
		items: 2,
	},
	tablet: {
		breakpoint: { max: 1024, min: 464 },
		items: 1,
	},
	mobile: {
		breakpoint: { max: 464, min: 0 },
		items: 1,
	},
};

const CustomRightArrow = ({ onClick, ...rest }) => {
	const {
		onMove,
		carouselState: { currentSlide, deviceType },
	} = rest;
	// onMove means if dragging or swiping in progress.
	return <button onClick={() => onClick()} />;
};
const customLeftArrow = ({ onClick, ...rest }) => {
	const {
		onMove,
		carouselState: { currentSlide, deviceType },
	} = rest;
	// onMove means if dragging or swiping in progress.
	return <button onClick={() => onClick()} />;
};
function BannerCard() {
	const classes = useStyles();

	return (
		<>
			<Carousel
				responsive={responsive}
				removeArrowOnDeviceType={['tablet', 'mobile']}
				autoPlay
				autoPlaySpeed={3000}
				infinite
				// customLeftArrow={<customLeftArrow />}
				// customRightArrow={<CustomRightArrow />}
			>
				{data.length > 0 &&
					data.map((item, i) => (
						<Card className={classes.cardRoot} key={i}>
							<CardActionArea>
								<CardMedia
									className={classes.cardMedia}
									component='img'
									image={item.img}
									title={item.title}
								/>
							</CardActionArea>
						</Card>
					))}
			</Carousel>
		</>
	);
}

export default BannerCard;

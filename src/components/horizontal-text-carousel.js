import * as React from 'react'
import {
	Text,
	View,
	StyleSheet,
	Dimensions
} from 'react-native'

import Carousel from 'react-native-snap-carousel'

export default class HorizontalTextCarousel extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			activeIndex: 0
		}
		this.renderItem = this.renderItem.bind(this)
	}

	renderItem({ item, index }) {
		return (
			<Text
				key={Math.floor(Math.random(index) * 10)}
				style={styles.text}
			>
				{item}
			</Text>
		)
	}

	render() {
		const {
			carouselItems,
			onItemSelected,
			carouselWidth,
			itemWidth,
			firstItem,
		} = this.props
		return (
			<Carousel
				firstItem={firstItem}
				ref={ref => this.carousel = ref}
				data={carouselItems}
				sliderWidth={carouselWidth}
				itemWidth={itemWidth}
				renderItem={this.renderItem}
				onSnapToItem={index => {
					this.setState({ activeIndex: index })
					onItemSelected(carouselItems[index])
				}}
			/>
		)
	}
}

const styles = StyleSheet.create({
	text: {
		color: '#fff',
		fontSize: 30,
		fontWeight: 'bold',
		textAlign: 'center',
		marginHorizontal: 0,
		fontFamily: 'Roboto'
	}
})
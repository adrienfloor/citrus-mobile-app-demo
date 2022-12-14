import * as React from 'react'
import {
	Text,
	View,
	StyleSheet,
	Dimensions
} from 'react-native'

import Carousel from 'react-native-snap-carousel'

export default class VerticalTextCarousel extends React.Component {

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
			firstItem
		} = this.props
		return (
			<Carousel
				firstItem={firstItem}
				layout='default'
				ref={ref => this.carousel = ref}
				data={carouselItems}
				sliderHeight={200}
				itemHeight={40}
				renderItem={this.renderItem}
				onSnapToItem={index => {
					this.setState({ activeIndex: index })
					onItemSelected(carouselItems[index])
				}}
				vertical={true}
			/>
		)
	}
}

const styles = StyleSheet.create({
	text: {
		color: '#fff',
		fontSize: 35,
		fontWeight: 'bold',
		textAlign: 'center',
		fontFamily: 'Roboto'
	}
})
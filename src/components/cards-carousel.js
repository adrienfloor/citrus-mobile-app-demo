import * as React from 'react'
import {
	Text,
	View,
	SafeAreaView,
	Dimensions
} from 'react-native'

import Carousel from 'react-native-snap-carousel'
import SessionCard from './session-card'

const { width: screenWidth } = Dimensions.get('window')
const { height: screenHeight } = Dimensions.get('window')

export default class CardsCarousel extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			activeIndex: 0
		}
		this.renderItem = this.renderItem.bind(this)
	}

	renderItem({ item, index }) {
		return (
			<SessionCard
				key={Math.floor(Math.random(index) * 10)}
				session={item}
				selectSession={() => this.props.selectItem(item)}
			/>
		)
	}

	render() {
		const { carouselItems } = this.props
		return (
			<Carousel
				layout='default'
				ref={ref => this.carousel = ref}
				data={carouselItems}
				sliderWidth={screenWidth}
				itemWidth={screenWidth*0.6}
				renderItem={this.renderItem}
				onSnapToItem={index => this.setState({ activeIndex: index })}
			/>
		)
	}
}


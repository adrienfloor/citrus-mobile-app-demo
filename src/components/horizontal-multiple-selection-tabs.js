import React from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	Text
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { headingStyles } from '../../assets/styles/headings'
import { uppercase } from '../utils/various'

class HorizontalMultipleSelectionTabs extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			itemsSelected: this.props.itemsSelected || []
		}
		this.handleItemSelection = this.handleItemSelection.bind(this)
	}

	handleItemSelection(index, item) {
		const { handlePress, resetItem } = this.props
		const { itemsSelected } = this.state

		console.log('reset item', item, resetItem)

		if(item == resetItem) {
			this.setState({
				itemsSelected: [resetItem]
			})
			return handlePress([resetItem])
		}

		if(itemsSelected.includes(item)) {
			this.setState({
				itemsSelected: itemsSelected.filter(el => el !== item && el !== resetItem)
			})
			handlePress(itemsSelected.filter(el => el !== item && el !== resetItem))
		} else {
			this.setState({
				itemsSelected: [
					...itemsSelected,
					item
				].filter(el => el !== resetItem)
			})
			handlePress([...itemsSelected, item].filter(el => el !== resetItem))
		}
	}

	componentDidUpdate() {
		if (this.props.itemsSelected !== this.state.itemsSelected) {
			this.setState({
				itemsSelected: this.props.itemsSelected
			})
		}
	}

	render() {
		const {
			items,
			isUpperCase,
			width,
			height
		} = this.props
		const { itemsSelected } = this.state

		return (
			<View style={styles.main}>
				{
					items.map((item, i) => (
						<TouchableOpacity
							style={[
								itemsSelected.includes(items[i]) ?
									styles.itemSelected :
									styles.item,
								{
									width,
									maxHeight: 25
								}
							]}
							key={i}
							onPress={() => {
								this.handleItemSelection(i, item)
							}}
						>
							<Text
								style={
									itemsSelected.includes(items[i]) ?
										{
											...headingStyles.smallText,
											color: '#0075FF'

										} :
										headingStyles.smallText
								}
							>
								{
									isUpperCase ?
										uppercase(item) :
										item
								}
							</Text>
						</TouchableOpacity>
					))
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		flex: 0,
		width: '100%',
		height: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		flexWrap: 'wrap'
	},
	item: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	itemSelected: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default HorizontalMultipleSelectionTabs
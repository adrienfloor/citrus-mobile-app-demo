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

class HorizontalSelectionTabs extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			itemSelected: this.props.itemSelected || 0
		}
		this.handleItemSelection = this.handleItemSelection.bind(this)
	}

	handleItemSelection(index, item) {
		const { handlePress } = this.props
		this.setState({
			itemSelected: index
		})
		handlePress(item)
	}

	componentDidUpdate() {
		const {
			itemSelected,
			updatedFromParent
		} = this.props

		if (itemSelected !== this.state.itemSelected && updatedFromParent) {
			this.setState({
				itemSelected: this.props.itemSelected
			})
		}
	}

	render() {
		const { items, isUpperCase } = this.props
		const { itemSelected } = this.state
		return (
			<View style={styles.main}>
				{
					items.map((item, i) => (
						<TouchableOpacity
							style={[
								itemSelected === i ?
								styles.itemSelected :
								styles.item,
								{
									minWidth: `${100/(items.length)}%`
								}
							]}
							key={i}
							onPress={() => {
								this.handleItemSelection(i, item)
							}}
						>
							<Text
								style={
									itemSelected === i ?
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
		alignItems: 'center'
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

export default HorizontalSelectionTabs
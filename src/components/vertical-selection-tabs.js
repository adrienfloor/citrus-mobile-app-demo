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

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

class VerticalSelectionTabs extends React.Component {
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
	render() {
		const { items } = this.props
		const { itemSelected } = this.state
		return (
			<View style={styles.main}>
				{
					items.map((item, i) => (
						<TouchableOpacity
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
								{uppercase(item.toString())}
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
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	item: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'green',
		minWidth: '100%'
	},
	itemSelected: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		// backgroundColor: 'yellow',
		minWidth: '100%'
	}
})

export default VerticalSelectionTabs
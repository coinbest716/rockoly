/** @format */

import React, {PureComponent} from 'react'
import {Modal, Text, BackHandler} from 'react-native'
import {Button} from 'native-base'
import ImageViewer from 'react-native-image-zoom-viewer'
import styles from './styles'

class ImageView extends PureComponent {
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount() {
    this.backHandler.remove()
  }

  render() {
    const {images, imageIndex, visible, onPress} = this.props
    console.log('imageIndex', imageIndex)
    return (
      <Modal visible={visible} transparent>
        <ImageViewer imageUrls={images} index={imageIndex} />
        <Button style={styles.iconZoom} onPress={onPress}>
          <Text style={styles.textClose}>Close</Text>
        </Button>
      </Modal>
    )
  }
}

export default ImageView

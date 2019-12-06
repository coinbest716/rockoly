/** @format */

import React, {PureComponent} from 'react'
import {TouchableOpacity, Modal, Text} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import styles from './styles'

class ImageView extends PureComponent {

  render() {
    const {images, imageIndex, visible, onPress} = this.props
    console.log('imageIndex', imageIndex)
    return (
      <Modal visible={visible} transparent>
        <ImageViewer imageUrls={images} index={imageIndex} />
        <TouchableOpacity style={styles.iconZoom} onPress={onPress}>
          <Text style={styles.textClose}>Close</Text>
        </TouchableOpacity>
      </Modal>
    )
  }
}

export default ImageView

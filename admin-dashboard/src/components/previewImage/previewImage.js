/** @format */

import React, {Component} from 'react'
import {Modal, Upload} from 'antd'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import Styles from './styles'

export class PreviewImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      galleryIndex: 0,
      previewData: [],
      gallery: [],
    }
  }

  componentDidMount() {
    console.log(this.props)
    if (this.props.attachment) {
      this.setState({previewData: this.props.attachment})
    }
    if (this.props.gallery) {
      this.setState({gallery: this.props.gallery})
    }
  }

  handlePreview = file => {
    this.setState({
      previewVisible: true,
      galleryIndex: file.uid,
    })
  }
  handleChange = ({fileList}) => this.setState({fileList})

  handleCancel = () => this.setState({previewVisible: false})

  render() {
    return (
      <div>
        <div style={Styles.workImageView}>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            disabled
            fileList={this.state.previewData}
            onPreview={this.handlePreview}
            onChange={this.handleChange}></Upload>
        </div>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <ImageGallery
            showPlayButton={false}
            startIndex={this.state.galleryIndex}
            items={this.state.gallery}
          />
        </Modal>
      </div>
    )
  }
}

export default PreviewImage

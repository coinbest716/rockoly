/** @format */

import React, {PureComponent} from 'react'
import {View} from 'react-native'
import {WebView} from 'react-native-webview'
import {Header, Spinner} from '@components'
import styles from './styles'

class WebViews extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      url: '',
      title: '',
    }
  }

  componentDidMount() {
    if (
      this.props &&
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.URL
    ) {
      this.setState({
        url: this.props.navigation.state.params.URL,
        title: this.props.navigation.state.params.title,
      })
    }
  }

  renderWebView() {
    const {url} = this.state

    if (!url) {
      return null
    }
    return (
      <WebView
        startInLoadingState
        renderLoading={() => <Spinner animating mode="full" />}
        source={{
          uri: url,
        }}
      />
    )
  }

  render() {
    const {title} = this.state
    return (
      <View style={styles.mainView}>
        <Header showBack title={title} />
        {this.renderWebView()}
      </View>
    )
  }
}
export default WebViews

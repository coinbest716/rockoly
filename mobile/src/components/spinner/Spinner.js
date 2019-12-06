/** @format */

import React from 'react'
import {View, ActivityIndicator, Dimensions, StyleSheet} from 'react-native'

import {Theme} from '@theme'

const {width, height} = Dimensions.get('window')

const SIZES = {SMALL: 'small', LARGE: 'large'}

export const Mode = {normal: 'normal', full: 'full', overlay: 'overlay'}

class Spinner extends React.PureComponent {
  // constructor(props) {
  //   super(props)
  // }

  // componentWillReceiveProps(nextProps) {
  //   const {animating} = nextProps
  //   this.setState({animating})
  // }

  render() {
    const {size, color, mode, animating} = this.props

    let containerStyle = {}
    switch (mode) {
      case Mode.full:
        containerStyle = styles.container_full_stretch
        break
      case Mode.overlay:
        containerStyle = styles.container_overlay
        break
      default:
        containerStyle = styles.container
        break
    }
    return (
      <View style={containerStyle}>
        <ActivityIndicator
          animating={animating}
          size={size}
          color={color}
          style={[styles.wrapper, {borderRadius: size === SIZES.SMALL ? 10 : 20}]}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: null,
    width: null,
  },
  container_full_stretch: {
    flexGrow: 1,
    height: null,
    width: null,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container_overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: 'transparent',
    zIndex: 100,
  },
})

Spinner.defaultProps = {
  color: Theme.Colors.primary,
  size: 'large',
  mode: Mode.normal,
}

export default Spinner

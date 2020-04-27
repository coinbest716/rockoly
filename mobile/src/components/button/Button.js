/**
 * Created by InspireUI on 17/02/2017.
 *
 * @format
 */

import React, {PureComponent} from 'react'
import {StyleSheet} from 'react-native'
import {Button, Text} from 'native-base'
import {Theme} from '@theme'

class CommonButton extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      btnText: props.btnText,
      onPress: props.onPress,
      containerStyle: props.containerStyle,
      textStyle: props.textStyle,
      disabled: props.disabled,
      danger: props.danger
    }
  }

  // componentDidMount() {
  //   this.setState(...this.props)
  // }

  componentWillReceiveProps(nextProps) {
    if (this.state.disabled !== nextProps.disabled)
      this.setState({
        disabled: nextProps.disabled,
      })
  }

  render() {
    const {btnText, onPress, containerStyle, textStyle, disabled, danger} = this.state
    return (
      <Button
        disabled={disabled}
        block
        style={[styles.container, containerStyle, !disabled ? styles.enabled : {}, danger ? styles.disabled : {}]}
        onPress={onPress}>
        <Text style={[styles.text, textStyle]}>{btnText}</Text>
      </Button>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 25,
    marginHorizontal: 10,
  },
  enabled: {
    backgroundColor: Theme.Colors.primary,
  },
  disabled: {
    backgroundColor: Theme.Colors.error,
  },
  text: {
    color: Theme.Colors.btnTextColor,
  },
})

export default CommonButton

/** @format */

import React, {PureComponent} from 'react'
import {View, StyleSheet, Text, Image} from 'react-native'
import {Icon} from 'native-base'
import {Theme} from '@theme'
import {RouteNames} from '@navigation'
import {TabBarService, TAB_EVENTS} from '@services'

class TabBarIcon extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showInfoIcon: false,
    }
  }

  componentDidMount() {
    try {
      const {customerKey} = this.props
      if (customerKey === RouteNames.CHEF_SETTING_STACK) {
        TabBarService.on(TAB_EVENTS.SHOW_INFO, this.showInfo)
      }
    } catch (e) {
      console.log('tab icon error', e)
    }
  }

  showInfo = ({showInfoIcon}) => {
    this.setState({
      showInfoIcon,
    })
  }

  render() {
    const {icon, tintColor, css, showCount, count, name, customerKey} = this.props
    const {showInfoIcon} = this.state

    const numberWrap = (number = 0) => (
      <View style={styles.numberWrap}>
        <Text style={styles.number}>{number}</Text>
      </View>
    )
    const infoIcon = () => {
      return <Icon name="information" type="MaterialCommunityIcons" style={styles.iconView} />
    }
    return (
      <View style={{justifyContent: 'center'}}>
        <Image
          ref={comp => (this._image = comp)}
          source={icon}
          style={[styles.icon, {tintColor}, css]}
        />
        {name ? <Text style={styles.tabName}>{name}</Text> : null}
        {showCount && count && numberWrap(count || 0)}
        {customerKey === RouteNames.CHEF_SETTING_STACK && showInfoIcon && infoIcon(count || 0)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  numberWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -10,
    right: -10,
    height: 18,
    minWidth: 18,
    backgroundColor: Theme.Colors.error,
    borderRadius: 9,
  },
  number: {
    color: 'white',
    fontSize: 12,
    marginLeft: 3,
    marginRight: 3,
  },
  iconView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -5,
    right: -15,
    fontSize: 18,
    color: Theme.Colors.error,
  },
  tabName: {
    textAlign: 'center',
    fontSize: 10,
  },
})

export default TabBarIcon

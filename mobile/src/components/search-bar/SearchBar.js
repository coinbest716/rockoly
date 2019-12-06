/** @format */

import React, {PureComponent} from 'react'
import {View, Image, TextInput, TouchableOpacity, Animated} from 'react-native'
// import Icon from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from './style'
import {Languages} from '@translations'
import {Theme} from '@theme'
import {Images} from '@images'

class SearchBar extends PureComponent {
  render() {
    const {
      autoFocus,
      value,
      onChangeText,
      onSubmitEditing,
      scrollY,
      onClear,
      onFilter,
      isShowFilter,
      haveFilter,
    } = this.props

    // const {
    //   theme: {
    //     colors: {text, lineColor},
    //   },
    // } = this.props

    // const transformY = scrollY.interpolate({
    //   inputRange: [0, 50],
    //   outputRange: [50, 0],
    //   extrapolate: 'clamp',
    // })

    return (
      <Animated.View
        style={[
          styles.container,
          {
            // transform: [{ translateY: transformY }],
          },
          // {backgroundColor: lineColor},
        ]}>
        <Icon
          name="search"
          size={20}
          // color={text}
        />
        <TextInput
          placeholder={Languages.chefList.SearchPlaceHolder}
          // placeholderTextColor={text}
          style={[
            styles.input,
            // {color: text}
          ]}
          underlineColorAndroid="transparent"
          autoFocus={autoFocus}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear}>
            <Image
              source={Images.icons.clearSearch}
              style={[
                styles.icon,
                //  {tintColor: text}
              ]}
            />
          </TouchableOpacity>
        )}

        <View
          style={[
            styles.separator,
            // {tintColor: text}
          ]}
        />

        <TouchableOpacity onPress={onFilter}>
          <Image
            source={Images.icons.filterSearch}
            style={[
              styles.icon,
              {
                tintColor: haveFilter
                  ? Theme.Colors.primary
                  : // text
                    Theme.Colors.lightgrey,
              },
            ]}
          />
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

export default SearchBar

/** @format */

import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import {
  HorizonList,
  ModalLayout,
  PostList,
  SearchBar,
  Button,
  Spinner,
  ButtonIndex,
} from '@components'
import styles from './styles'

export default class List extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {
      data,
      refreshing,
      renderItem,
      extraData,
      isNextFetching,
      onLoadMore,
      refreshData,
    } = this.props
    return (
      <View>
        <FlatList
          data={data}
          refreshing={refreshing}
          onRefresh={() => refreshData()}
          renderItem={renderItem}
          extraData={extraData}
          onEndReachedThreshold={0.5}
          onEndReached={() => {}}
        />
      </View>
    )
  }
}

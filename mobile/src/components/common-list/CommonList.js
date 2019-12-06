/** @format */

import React, {PureComponent} from 'react'
import {View, FlatList, ScrollView, RefreshControl} from 'react-native'
import {Text} from 'native-base'
import _ from 'lodash'
import {Spinner} from '@components'
import styles from './styles'

export default class CommonList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      keyExtractor: props.keyExtractor,
      renderItem: props.renderItem,
      loadMore: props.loadMore,
      emptyDataMessage: props.emptyDataMessage,
      reload: props.reload,
      data: props.data,
      isFetching: props.isFetching,
      isFetchingMore: props.isFetchingMore,
      canLoadMore: props.canLoadMore,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      isFetching: nextProps.isFetching,
      isFetchingMore: nextProps.isFetchingMore,
      canLoadMore: nextProps.canLoadMore,
    })
  }

  loadMoreData = () => {
    const {canLoadMore, isFetchingMore, loadMore} = this.state
    if (canLoadMore && !isFetchingMore && loadMore) {
      loadMore()
    }
  }

  _refreshControl = () => {
    const {isFetching, reload} = this.state
    if (reload) {
      return <RefreshControl refreshing={isFetching} onRefresh={() => reload && reload()} />
    }
    return null
  }

  keyExtractor = item => {
    const {keyExtractor} = this.state
    if (item && item.hasOwnProperty(keyExtractor)) {
      return item[keyExtractor]
    }
    return (Math.floor(Math.random() * 9000000000) + 1000000000).toString()
  }

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 50
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
  }

  render() {
    const {data, renderItem, isFetching, isFetchingMore, canLoadMore, emptyDataMessage} = this.state

    if (isFetching) {
      return (
        <View style={[styles.alignScreenCenter]}>
          <Spinner animating mode="full" />
        </View>
      )
    }

    if (!data || data.length === 0) {
      return (
        <View style={[styles.alignScreenCenter]}>
          <Text>{emptyDataMessage}</Text>
        </View>
      )
    }

    const list = []
    list.push(
      <ScrollView
        refreshControl={this._refreshControl()}
        scrollEventThrottle={16}
        onScroll={({nativeEvent}) => {
          if (this.isCloseToBottom(nativeEvent)) {
            this.loadMoreData()
          }
        }}>
        <FlatList keyExtractor={() => this.keyExtractor()} data={data} renderItem={renderItem} />
        {isFetchingMore ? <Spinner mode="full" /> : null}
        {!canLoadMore ? (
          <Text style={{alignSelf: 'center', marginVertical: 5, fontSize: 12}}>
            No more data to load.
          </Text>
        ) : null}
      </ScrollView>
    )

    return list
  }
}

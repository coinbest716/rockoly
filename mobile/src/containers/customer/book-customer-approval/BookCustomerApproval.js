/** @format */

import React, {Component} from 'react'
import {View, ScrollView, Platform} from 'react-native'
import {
  Container,
  Item,
  Textarea,
  Text,
  Input,
  Content,
  Form,
  CheckBox,
  ListItem,
  Body,
  Icon,
  Left,
  Button,
  Label,
  Toast,
  Card,
  Accordion,
} from 'native-base'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import _ from 'lodash'
import {CustomerApproval} from '@containers'
import {CommonButton, Spinner, Header} from '@components'
import {Theme} from '@theme'
import {LocalToGMT} from '@utils'
import {AuthContext} from '@services'
import {Languages} from '@translations'
import styles from './styles'
import {RouteNames} from '@navigation'

export default class BookCustomerApproval extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount() {}

  getCustomerApprovalValue = value => {
    const {navigation} = this.props
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Header showBack title={Languages.book.labels.customerApproval} showBell={false} />
        <CustomerApproval getValue={this.getCustomerApprovalValue} />
        {Platform.OS === 'ios' && <KeyboardSpacer />}
      </View>
    )
  }
}

BookCustomerApproval.contextType = AuthContext

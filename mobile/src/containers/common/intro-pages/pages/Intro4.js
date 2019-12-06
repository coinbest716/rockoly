/** @format */

import React, {Component} from 'react'
import {View, Image, Text} from 'react-native'
import {Images} from '@images'
import IntroData from '../../../../utils/IntroData'
import Styles from './styles'

export default class Home3 extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {introValue} = this.props
    let questionDesc = ''
    let questionOptionDesc = ''
    if (introValue && introValue.nodes && introValue.nodes.length > 0) {
      const value = introValue.nodes[3]
      if (value.questionDesc) {
        questionDesc = value.questionDesc
      }
      const arrayValue = value.questionOptionMastersByQuestionId.nodes[0]
      if (arrayValue.questionOptionDesc) {
        questionOptionDesc = arrayValue.questionOptionDesc
      }
    }
    return (
      <View style={Styles.mainView}>
        <View>
          <Image style={Styles.bannerImage} source={Images.chef.chef} />
        </View>
        <View style={Styles.container}>
          <View style={Styles.bodyContainer}>
            <Text style={Styles.bullet}> {'\u2B24'}</Text>
            <Text style={Styles.bodyText}>{questionDesc}</Text>
          </View>
          <View style={Styles.bodyContainer}>
            <Text style={Styles.bullet}> {'\u2B24'}</Text>
            <Text style={Styles.bodyText}>{questionOptionDesc}</Text>
          </View>
        </View>
      </View>
    )
  }
}

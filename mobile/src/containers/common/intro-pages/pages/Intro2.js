/** @format */

import React, {Component} from 'react'
import {View, Image, Text} from 'react-native'
import {Images} from '@images'
import IntroData from '../../../../utils/IntroData'
import Styles from './styles'

// TODO:boopathi
// 1. why class name is different from file name.
// 2. Import the text from const
// 3. Fix eslint error
export default class Home1 extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const {introValue} = this.props
    let questionDesc = ''
    let questionOptionDesc = ''
    let questionOptionDesc1 = ''
    if (introValue && introValue.nodes && introValue.nodes.length > 0) {
      const value = introValue.nodes[1]
      if (value.questionDesc) {
        questionDesc = value.questionDesc
      }
      const arrayValue = value.questionOptionMastersByQuestionId.nodes[0]
      if (arrayValue.questionOptionDesc) {
        questionOptionDesc = arrayValue.questionOptionDesc
      }
      const arrayValue1 = value.questionOptionMastersByQuestionId.nodes[1]
      if (arrayValue1.questionOptionDesc) {
        questionOptionDesc1 = arrayValue1.questionOptionDesc
      }
    }
    return (
      <View style={Styles.mainView}>
        <View>
          <Image style={Styles.bannerImage} source={Images.chef.leaf} />
        </View>
        <View style={Styles.container}>
          <Text style={Styles.question}>{questionDesc}</Text>
          <View style={Styles.bodyContainer}>
            <Text style={Styles.bullet}> {'\u2B24'}</Text>
            <Text style={Styles.bodyText}>{questionOptionDesc}</Text>
          </View>
          <View style={Styles.bodyContainer}>
            <Text style={Styles.bullet}> {'\u2B24'}</Text>
            <Text style={Styles.bodyText}>{questionOptionDesc1}</Text>
          </View>
        </View>
      </View>
    )
  }
}

/** @format */

import React, {Component} from 'react'
import {View, Text, ScrollView} from 'react-native'
import {ListItem, Radio, Right, Left} from 'native-base'
import {Theme} from '@theme'
import IntroData from '../../../../utils/IntroData'
import Styles from './styles'

export default class Home4 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeBoston: '',
      practice: '',
      education: '',
      service: '',
    }
  }

  render() {
    const {introValue, sendQuesAns} = this.props
    const {timeBoston, practice, education, service} = this.state
    let questionDesc = ''
    let questionOptionDesc = ''
    let questionOptionDesc1 = ''
    let questionOptionDesc2 = ''
    let question = ''
    let question1 = ''
    let question2 = ''
    let question3 = ''
    let education1 = ''
    let education2 = ''
    let education3 = ''
    let service1 = ''
    let service2 = ''
    let service3 = ''
    let timequsid = ''
    let timeansid = ''
    let timeansid1 = ''
    let timeansid2 = ''
    let practicequsid = ''
    let practiceansid1 = ''
    let practiceansid2 = ''
    let practiceansid3 = ''
    let eduqusid = ''
    let eduansid1 = ''
    let eduansid2 = ''
    let serqusid = ''
    let seransid1 = ''
    let seransid2 = ''
    if (introValue && introValue.nodes && introValue.nodes.length > 0) {
      const value = introValue.nodes[4]
      if (value.questionDesc) {
        questionDesc = value.questionDesc
      }
      if (value.questionId) {
        timequsid = value.questionId
      }
      const arrayValue = value.questionOptionMastersByQuestionId.nodes[0]
      if (arrayValue.questionOptionDesc) {
        questionOptionDesc = arrayValue.questionOptionDesc
      }
      if (arrayValue.questionOptionId) {
        timeansid = arrayValue.questionOptionId
      }
      const arrayValue1 = value.questionOptionMastersByQuestionId.nodes[1]
      if (arrayValue1.questionOptionDesc) {
        questionOptionDesc1 = arrayValue1.questionOptionDesc
      }
      if (arrayValue1.questionOptionId) {
        timeansid1 = arrayValue1.questionOptionId
      }

      const arrayValue2 = value.questionOptionMastersByQuestionId.nodes[2]
      if (arrayValue2.questionOptionDesc) {
        questionOptionDesc2 = arrayValue2.questionOptionDesc
      }
      if (arrayValue2.questionOptionId) {
        timeansid2 = arrayValue2.questionOptionId
      }

      const qusValue = introValue.nodes[5]
      if (qusValue.questionDesc) {
        question = qusValue.questionDesc
      }
      if (qusValue.questionId) {
        practicequsid = qusValue.questionId
      }
      const ques1 = qusValue.questionOptionMastersByQuestionId.nodes[0]
      if (ques1.questionOptionDesc) {
        question1 = ques1.questionOptionDesc
      }
      if (ques1.questionOptionId) {
        practiceansid1 = ques1.questionOptionId
      }
      const ques2 = qusValue.questionOptionMastersByQuestionId.nodes[1]
      if (ques2.questionOptionDesc) {
        question2 = ques2.questionOptionDesc
      }
      if (ques2.questionOptionId) {
        practiceansid2 = ques2.questionOptionId
      }
      const ques3 = qusValue.questionOptionMastersByQuestionId.nodes[2]
      if (ques3.questionOptionDesc) {
        question3 = ques3.questionOptionDesc
      }
      if (ques3.questionOptionId) {
        practiceansid3 = ques3.questionOptionId
      }
      const eduqus = introValue.nodes[6]

      if (eduqus.questionDesc) {
        education1 = eduqus.questionDesc
      }
      if (eduqus.questionId) {
        eduqusid = eduqus.questionId
      }
      const eduqus1 = eduqus.questionOptionMastersByQuestionId.nodes[0]
      if (eduqus1.questionOptionDesc) {
        education2 = eduqus1.questionOptionDesc
      }
      if (eduqus1.questionOptionId) {
        eduansid1 = eduqus1.questionOptionId
      }
      const eduqus2 = eduqus.questionOptionMastersByQuestionId.nodes[1]
      if (eduqus2.questionOptionDesc) {
        education3 = eduqus2.questionOptionDesc
      }
      if (eduqus2.questionOptionId) {
        eduansid2 = eduqus2.questionOptionId
      }
      const ser = introValue.nodes[7]

      if (ser.questionDesc) {
        service1 = ser.questionDesc
      }
      if (ser.questionId) {
        serqusid = ser.questionId
      }
      const ser1 = ser.questionOptionMastersByQuestionId.nodes[0]
      if (ser1.questionOptionDesc) {
        service2 = ser1.questionOptionDesc
      }
      if (ser1.questionOptionId) {
        seransid1 = ser1.questionOptionId
      }
      const ser2 = ser.questionOptionMastersByQuestionId.nodes[1]
      if (ser2.questionOptionDesc) {
        service3 = ser2.questionOptionDesc
      }
      if (ser2.questionOptionId) {
        seransid2 = ser2.questionOptionId
      }
    }

    return (
      <ScrollView style={Styles.mainView}>
        <View style={Styles.container}>
          <View>
            <Text style={Styles.radioQuestion}>{questionDesc}</Text>
            <ListItem
              style={Styles.listItem}
              onPress={() =>
                this.setState({timeBoston: questionOptionDesc}, () => {
                  this.props.sendQuesAns(timequsid, timeansid)
                })
              }>
              <Left>
                <Text style={Styles.radioText}>{questionOptionDesc}</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() =>
                    this.setState({timeBoston: questionOptionDesc}, () => {
                      this.props.sendQuesAns(timequsid, timeansid)
                    })
                  }
                  selected={timeBoston === questionOptionDesc}
                  selectedColor={Theme.Colors.primary}
                />
              </Right>
            </ListItem>
            <ListItem
              style={Styles.listItem}
              onPress={() =>
                this.setState({timeBoston: questionOptionDesc1}, () => {
                  this.props.sendQuesAns(timequsid, timeansid1)
                })
              }>
              <Left>
                <Text style={Styles.radioText}>{questionOptionDesc1}</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() =>
                    this.setState({timeBoston: questionOptionDesc1}, () => {
                      this.props.sendQuesAns(timequsid, timeansid1)
                    })
                  }
                  selected={timeBoston === IntroData.TimeQuestion.answer2}
                  selectedColor={Theme.Colors.primary}
                />
              </Right>
            </ListItem>
            <ListItem
              style={Styles.listItem}
              onPress={() =>
                this.setState({timeBoston: questionOptionDesc2}, () => {
                  this.props.sendQuesAns(timequsid, timeansid2)
                })
              }>
              <Left>
                <Text style={Styles.radioText}>{questionOptionDesc2}</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() =>
                    this.setState({timeBoston: questionOptionDesc2}, () => {
                      this.props.sendQuesAns(timequsid, timeansid2)
                    })
                  }
                  selected={timeBoston === IntroData.TimeQuestion.answer3}
                  selectedColor={Theme.Colors.primary}
                />
              </Right>
            </ListItem>
          </View>
          <View>
            <Text style={Styles.radioQuestion}>{question}</Text>
            <ListItem
              style={Styles.listItem}
              onPress={() =>
                this.setState({practice: question1}, () => {
                  this.props.sendQuesAns(practicequsid, practiceansid1)
                })
              }>
              <Left>
                <Text style={Styles.radioText}>{question1}</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() =>
                    this.setState({practice: question1}, () => {
                      this.props.sendQuesAns(practicequsid, practiceansid1)
                    })
                  }
                  selected={practice === question1}
                  selectedColor={Theme.Colors.primary}
                />
              </Right>
            </ListItem>
            <ListItem
              style={Styles.listItem}
              onPress={() =>
                this.setState({practice: question2}, () => {
                  this.props.sendQuesAns(practicequsid, practiceansid2)
                })
              }>
              <Left>
                <Text style={Styles.radioText}>{question2}</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() =>
                    this.setState({practice: question2}, () => {
                      this.props.sendQuesAns(practicequsid, practiceansid2)
                    })
                  }
                  selected={practice === question2}
                  selectedColor={Theme.Colors.primary}
                />
              </Right>
            </ListItem>
            <ListItem
              style={Styles.listItem}
              onPress={() =>
                this.setState({practice: question3}, () => {
                  this.props.sendQuesAns(practicequsid, practiceansid3)
                })
              }>
              <Left>
                <Text style={Styles.radioText}>{question3}</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() =>
                    this.setState({practice: question3}, () => {
                      this.props.sendQuesAns(practicequsid, practiceansid3)
                    })
                  }
                  selected={practice === question3}
                  selectedColor={Theme.Colors.primary}
                />
              </Right>
            </ListItem>
          </View>
          <View>
            <Text style={Styles.radioQuestion}>{education1}</Text>
            <ListItem
              style={Styles.listItem}
              onPress={() =>
                this.setState({education: education2}, () => {
                  this.props.sendQuesAns(eduqusid, eduansid1)
                })
              }>
              <Left>
                <Text style={Styles.radioText}>{education2}</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() =>
                    this.setState({education: education2}, () => {
                      this.props.sendQuesAns(eduqusid, eduansid1)
                    })
                  }
                  selected={education === education2}
                  selectedColor={Theme.Colors.primary}
                />
              </Right>
            </ListItem>
            <ListItem
              style={Styles.listItem}
              onPress={() =>
                this.setState({education: education3}, () => {
                  this.props.sendQuesAns(eduqusid, eduansid2)
                })
              }>
              <Left>
                <Text style={Styles.radioText}>{education3}</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() =>
                    this.setState({education: education3}, () => {
                      this.props.sendQuesAns(eduqusid, eduansid2)
                    })
                  }
                  selected={education === education3}
                  selectedColor={Theme.Colors.primary}
                />
              </Right>
            </ListItem>
          </View>
          <View>
            <Text style={Styles.radioQuestion}>{service1}</Text>
            <ListItem
              style={Styles.listItem}
              onPress={() =>
                this.setState({service: service2}, () => {
                  this.props.sendQuesAns(serqusid, seransid1)
                })
              }>
              <Left>
                <Text style={Styles.radioText}>{service2}</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() =>
                    this.setState({service: service2}, () => {
                      this.props.sendQuesAns(serqusid, seransid1)
                    })
                  }
                  selected={service === service2}
                  selectedColor={Theme.Colors.primary}
                />
              </Right>
            </ListItem>
            <ListItem
              style={Styles.listItem}
              onPress={() =>
                this.setState({service: service3}, () => {
                  this.props.sendQuesAns(serqusid, seransid2)
                })
              }>
              <Left>
                <Text style={Styles.radioText}>{service3}</Text>
              </Left>
              <Right>
                <Radio
                  onPress={() =>
                    this.setState({service: service3}, () => {
                      this.props.sendQuesAns(serqusid, seransid2)
                    })
                  }
                  selected={service === service3}
                  selectedColor={Theme.Colors.primary}
                />
              </Right>
            </ListItem>
          </View>
        </View>
      </ScrollView>
    )
  }
}

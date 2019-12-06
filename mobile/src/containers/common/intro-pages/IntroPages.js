/** @format */

import React, {PureComponent} from 'react'
import {View} from 'react-native'
import {Icon, Toast} from 'native-base'
import AppIntroSlider from 'react-native-app-intro-slider'
import AsyncStorage from '@react-native-community/async-storage'
import {IntroService, INTRO_LIST_EVENT} from '@services'
import {STORAGE_KEY_NAME} from '@utils'
import {Spinner} from '@components'
import {ResetStack, RouteNames} from '@navigation'
import {AuthContext} from '../../../AuthContext'
import Intro1 from './pages/Intro1'
import Intro2 from './pages/Intro2'
import Intro3 from './pages/Intro3'
import Intro4 from './pages/Intro4'
import Intro5 from './pages/Intro5'
import styles from './styles'
import {Theme} from '@theme'

class IntroPages extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isIntroSlidesSeenYn: false,
      quesAns: [],
      intro: [
        {
          key: 'page1',
        },
        {
          key: 'page2',
        },
        {
          key: 'page3',
        },
        {
          key: 'page4',
        },
        {
          key: 'page5',
        },
      ],
    }
  }

  async componentDidMount() {
    IntroService.on(INTRO_LIST_EVENT.INTRO_LIST, this.setList)
    IntroService.on(INTRO_LIST_EVENT.INTRO_CHECK, this.introCheckList)
    IntroService.firstScreen()

    const {navigation} = this.props
    const {getProfile} = this.context
    const profile = await getProfile()

    try {
      if (
        profile &&
        profile.chefProfileExtendedsByChefId &&
        profile.chefProfileExtendedsByChefId.nodes &&
        profile.chefProfileExtendedsByChefId.nodes.length
      ) {
        const {isIntroSlidesSeenYn} = profile.chefProfileExtendedsByChefId.nodes[0]

        if (isIntroSlidesSeenYn === false) {
          this.setState({
            isLoading: false,
          })
        } else {
          ResetStack(navigation, RouteNames.CHEF_MAIN_TAB)
        }
      } else {
        ResetStack(navigation, RouteNames.CHEF_MAIN_TAB)
      }
    } catch (e) {
      ResetStack(navigation, RouteNames.CHEF_MAIN_TAB)
    }
  }

  componentWillUnmount() {
    IntroService.off(INTRO_LIST_EVENT.INTRO_LIST, this.setList)
    IntroService.off(INTRO_LIST_EVENT.INTRO_CHECK, this.introCheckList)
    IntroService.off(INTRO_LIST_EVENT.INTRO_DATA, this.setQuestionList)
  }

  setList = ({introList}) => {
    if (Object.keys(introList).length !== 0) {
      if (introList.hasOwnProperty('allQuestionMasters')) {
        const questions = introList.allQuestionMasters
        if (questions) {
          this.setState({
            intro: [
              {
                key: 'page1',
                introList: questions,
              },
              {
                key: 'page2',
                introList: questions,
              },
              {
                key: 'page3',
                introList: questions,
              },
              {
                key: 'page4',
                introList: questions,
              },
              {
                key: 'page5',
                introList: questions,
              },
            ],
          })
        }
      }
    }
  }

  setValue = (questionId, answer) => {
    const {quesAns} = this.state
    const temp = {question: questionId, answerid: answer}
    quesAns.push(temp)
  }

  _renderItem = props => {
    const {item, index, dimensions} = props
    if (item && item.introList && item.introList.nodes) {
      if (item.key === 'page1') {
        return <Intro1 introValue={item.introList} />
      }
      if (item.key === 'page2') {
        return <Intro2 introValue={item.introList} />
      }
      if (item.key === 'page3') {
        return <Intro3 introValue={item.introList} />
      }
      if (item.key === 'page4') {
        return <Intro4 introValue={item.introList} />
      }
      if (item.key === 'page5') {
        return <Intro5 sendQuesAns={this.setValue} introValue={item.introList} />
      }
    }
  }

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon type="Ionicons" name="md-arrow-round-forward" style={{fontSize: 24}} />
      </View>
    )
  }

  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon type="Ionicons" name="md-checkmark" style={{fontSize: 24}} />
      </View>
    )
  }

  setQuestionList = ({introData}) => {
    if (introData !== undefined && introData !== {}) {
      this.setState({
        introData,
      })
    }
  }

  introCheckList = () => {
    const {navigation} = this.props
    ResetStack(navigation, RouteNames.CHEF_MAIN_TAB)
  }

  _finishIntro = async () => {
    const {quesAns} = this.state
    const {currentUser} = this.context

    this.setState({
      isLoading: true,
    })

    if (quesAns && quesAns.length !== 0 && quesAns.length === 4) {
      try {
        await quesAns.map(data => {
          IntroService.on(INTRO_LIST_EVENT.INTRO_DATA, this.setQuestionList)
          IntroService.introQuestions(data.question, data.answerid, currentUser.chefId)
        })
        IntroService.introCheck(currentUser.chefProfileExtendedId)
      } catch (e) {
        this.introCheckList()
      }
    } else {
      try {
        IntroService.introCheck(currentUser.chefProfileExtendedId)
      } catch (e) {
        this.introCheckList()
      }
      // Toast.show({
      //   text: 'Please fill the details',
      //   duration: 3000,
      // })
    }
  }

  render() {
    const {intro, isLoading} = this.state

    if (isLoading) {
      return (
        <View style={{flex: 1}}>
          <Spinner color={Theme.Colors.primary} mode="full" />
        </View>
      )
    }
    return (
      <AppIntroSlider
        slides={intro}
        renderItem={this._renderItem}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        onDone={() => this._finishIntro()}
        activeDotStyle={{backgroundColor: Theme.Colors.primary}}
      />
    )
  }
}

IntroPages.contextType = AuthContext
export default IntroPages

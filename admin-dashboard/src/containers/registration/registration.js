/** @format */

import React, {Component} from 'react'
import {Form, Divider, Input, Button, DatePicker} from 'antd'
import {withRouter} from 'react-router-dom'
import Styles from './styles'
import CommonLables from '../common/commonLabel'
import Labels from './labels'
import n from '../routes/routesNames'

export class Registration extends Component {
  constructor() {
    super()
    this.state = {
      type: '',
      screen: '',
    }
  }
  componentDidMount() {
    if (this.props && this.props.location && this.props.location.state) {
      this.setState(
        {type: this.props.location.state.type, screen: this.props.location.state.screen},
        () => {
          console.log('type', this.state.type, this.state.screen)
        }
      )
    }
  }

  onClickBack = () => {
    if (this.state.screen === CommonLables.DASHBOARD) {
      this.props.history.push(n.DASHBOARD)
    } else if (this.state.screen === CommonLables.CUSTOMERMANAGEMENT) {
      this.props.history.push(n.CUSTOMERMANAGEMENT)
    } else if (this.state.screen === CommonLables.CHEFMANAGEMENT) {
      this.props.history.push(n.CHEFMANAGEMENT)
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }
  validateToNextPassword = (rule, value, callback) => {
    const {form} = this.props
    if (value) {
      form.validateFields([Labels.CONFIRM], {force: true})
    }
    callback()
  }
  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <div>
        <div style={Styles.formCardView}>
          <p style={Styles.titleTextStyle}>{this.state.type}</p>
          <Divider style={Styles.diverStyle} />
          <Form onSubmit={this.handleSubmit}>
            <div style={Styles.nameStyle}>
              <div style={Styles.alignFields}>
                <Form.Item label={Labels.FIRST_NAME}>
                  {getFieldDecorator(Labels.FIRSTNAME, {
                    rules: [{required: true, message: Labels.FIRSTNAME_ERROR, whitespace: true}],
                  })(<Input style={Styles.inputStyle} />)}
                </Form.Item>
              </div>
              <div style={Styles.alignFields}>
                <Form.Item label={Labels.LAST_NAME}>
                  {getFieldDecorator(Labels.LASTNAME, {
                    rules: [{required: true, message: Labels.LASTNAME_ERROR, whitespace: true}],
                  })(<Input style={Styles.inputStyle} />)}
                </Form.Item>
              </div>
            </div>
            <div style={Styles.alignFields}>
              <Form.Item label={Labels.EMAIL}>
                {getFieldDecorator(Labels.EMAIL_LOWER, {
                  rules: [
                    {
                      type: Labels.EMAIL_LOWER,
                      message: Labels.EMAIL_VALIDATION,
                    },
                    {
                      required: true,
                      message: Labels.EMAIL_ERROR,
                    },
                  ],
                })(<Input style={Styles.inputStyle} />)}
              </Form.Item>
            </div>
            <div style={Styles.alignFields}>
              <Form.Item label={Labels.DOF}>
                {getFieldDecorator(Labels.DATE_PICKER, {
                  rules: [{required: true, message: Labels.DOF_ERROR}],
                })(<DatePicker style={Styles.inputStyle} />)}
              </Form.Item>
            </div>
            <div style={Styles.alignFields}>
              <Form.Item label={Labels.PHONE_NUMBER}>
                {getFieldDecorator(Labels.PHONE, {
                  rules: [{required: true, message: Labels.PHONE_NUMBER_ERROR}],
                })(<Input style={Styles.inputStyle} />)}
              </Form.Item>
            </div>
            <div style={Styles.alignFields}>
              <Form.Item label={Labels.PASSWORD} hasFeedback>
                {getFieldDecorator(Labels.PASSWORD_LOWER, {
                  rules: [
                    {
                      required: true,
                      message: Labels.PASSWORD_ERROR,
                    },
                    {
                      validator: this.validateToNextPassword,
                    },
                  ],
                })(<Input.Password style={Styles.inputStyle} />)}
              </Form.Item>
            </div>

            <div style={Styles.buttonView}>
              <Button style={Styles.addUserStyle} onClick={() => this.onClickBack()}>
                {CommonLables.BACK}
              </Button>
              <Button style={Styles.addUserStyle} htmlType={Labels.SUBMIT}>
                {CommonLables.ADD}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

export default withRouter(Form.create()(Registration))

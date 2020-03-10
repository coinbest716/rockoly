/** @format */

import React, {Component} from 'react'
import {Card, Button, Table, Divider, Input, Modal, message} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import {
  getAdditionalServiceList,
  createAdditionalService,
  deleteAdditionalFunction,
  updateAdditionalFunction,
} from '../../actions/index'
import Styles from './styles'
import CommonLabels from '../common/commonLabel'

export class ExtraService extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allAdditionalService: [],
      cancellationTime: 0,
      updateTime: 0,
      editVisible: false,
      editValue: '',
      editStatus: '',
      editId: '',
      visible: false,
      stateValue: '',
      statusId: '',
    }
  }

  componentDidMount() {
    const {client} = this.props
    this.props.getAdditionalServiceList(client)
  }
  componentWillReceiveProps(nxtprops) {
    console.log('nxtprops', nxtprops)
    if (nxtprops.allAdditionalService) {
      const temp = nxtprops.allAdditionalService.map((item, index) => {
        return {
          ...item,
          keyValue: index + 1,
        }
      })
      this.setState({allAdditionalService: temp})
    }
    console.log('prps', this.props.deleteAdditionalService, nxtprops.deleteAdditionalService)
    if (this.props.deleteAdditionalService !== nxtprops.deleteAdditionalService) {
      const {client} = this.props

      this.props.getAdditionalServiceList(client)
    }
    if (this.props.updateAdditionalService !== nxtprops.updateAdditionalService) {
      const {client} = this.props

      this.props.getAdditionalServiceList(client)
    }
    if (this.props.addAdditionalService !== nxtprops.addAdditionalService) {
      const {client} = this.props

      this.props.getAdditionalServiceList(client)
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }
  editCancel = () => {
    this.setState({
      editVisible: false,
    })
  }
  onEdit = (Id, edit, status) => {
    this.setState({editVisible: true, editValue: edit, editId: Id, editStatus: status})
  }
  editModal = () => {
    return (
      <div>
        <Modal
          title="Basic Modal"
          visible={this.state.editVisible}
          onOk={this.onEditOk}
          onCancel={this.editCancel}>
          <p>Service Name</p>
          <Input
            value={this.state.editValue}
            onChange={e => this.editValue(e.target.value)}
            style={{width: '70%', marginTop: 0}}
          />
        </Modal>
      </div>
    )
  }
  editValue = val => {
    this.setState({editValue: val}, () => {})
  }
  onDelete = (props, typeId, typeName) => {
    const {client} = props
    Modal.confirm({
      title: 'Do you want to delete these items?',
      onOk() {
        props.deleteAdditionalFunction(typeId, typeName, 'DELETED', client)
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          message.success('Additional service deleted sucessfully')
        }).catch(() => console.log('Oops errors!'))
      },
      onCancel() {},
    })
  }
  assignSearchVakue = val => {
    this.setState({stateValue: val}, () => {
      console.log('status', this.state.stateValue)
    })
  }
  onEditOk = () => {
    console.log('state', this.state.editValue)
    const {client} = this.props

    this.props.updateAdditionalFunction(
      this.state.editId,
      this.state.editValue,
      this.state.editStatus,
      client
    )
    this.setState({editVisible: false}, () => {
      message.success('Edited additional service  sucessfully')
    })
  }
  handleOk = () => {
    const {client} = this.props
    this.props.createAdditionalService(this.state.stateValue, 'APPROVED', client)
    this.setState(
      {
        visible: false,
        stateValue: null,
      },
      () => {
        message.success('Added additional service sucessfully')
      }
    )
  }

  handleCancel = () => {
    this.setState({visible: false})
  }
  render() {
    const {allAdditionalService, visible} = this.state

    const columns = [
      {
        title: <b>{CommonLabels.SERIAL_NUMBER}</b>,
        width: 70,
        render(val) {
          return <p style={{marginTop: 14}}>{`# ${val.keyValue}`}</p>
        },
      },
      {
        title: <b>Service Name</b>,
        dataIndex: 'additionalServiceTypeName',
        key: 'additionalServiceTypeName',
      },

      {
        title: <b>Action</b>,
        key: 'action',
        render: item => (
          <span>
            <Button
              type="primary"
              ghost
              style={{fontSize: 12, fontWeight: 'bold'}}
              onClick={() =>
                this.onEdit(
                  item.additionalServiceTypeId,
                  item.additionalServiceTypeName,
                  item.statusId
                )
              }>
              {' '}
              Edit
            </Button>
            <Divider type="vertical" />
            <Button
              type="danger"
              ghost
              style={{fontSize: 12, fontWeight: 'bold'}}
              onClick={() =>
                this.onDelete(
                  this.props,
                  item.additionalServiceTypeId,
                  item.additionalServiceTypeName
                )
              }>
              Delete
            </Button>
          </span>
        ),
      },
    ]
    console.log('allAdditionalservice', allAdditionalService)
    return (
      <div style={Styles.cencelTimeViiiew}>
        <Card title={CommonLabels.ADDITIONAL_SER} style={Styles.innerCardWidth}>
          <div
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              display: 'flex',
            }}>
            <Button
              type="primary"
              icon="plus"
              style={{fontSize: 12, fontWeight: 'bold'}}
              onClick={this.showModal}>
              Add Item
            </Button>
          </div>
          <Table columns={columns} style={{marginTop: 10}} dataSource={allAdditionalService} />
        </Card>
        <Modal
          visible={visible}
          title="Additional Service"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              Save
            </Button>,
          ]}>
          <p style={{fontSize: 20, fontWeight: 'bold'}}>Service Name:</p>
          <Input
            placeholder="Service Name"
            value={this.state.stateValue}
            onChange={e => this.assignSearchVakue(e.target.value)}
            style={{width: '70%', marginTop: 0}}
          />
        </Modal>
        {this.editModal()}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {allAdditionalService, allAdditionalServiceLoading} = state.additionalService
  const {addAdditionalService, addAdditionalServiceLoading} = state.addAdditionalService
  const {deleteAdditionalService, deleteAdditionalServiceLoading} = state.deleteAdditionalService
  const {updateAdditionalService, updateAdditionalServiceLoading} = state.updateAdditionalService

  return {
    allAdditionalService,
    allAdditionalServiceLoading,
    addAdditionalService,
    addAdditionalServiceLoading,
    deleteAdditionalService,
    deleteAdditionalServiceLoading,
    updateAdditionalService,
    updateAdditionalServiceLoading,
  }
}

const mapDispatchToProps = {
  getAdditionalServiceList,
  createAdditionalService,
  deleteAdditionalFunction,
  updateAdditionalFunction,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ExtraService)
)

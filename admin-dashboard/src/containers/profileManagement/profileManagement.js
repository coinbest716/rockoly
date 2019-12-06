/** @format */

import React, {Component} from 'react'
import {Table, Icon, Button} from 'antd'
import {DATA} from '../staticData/customerData'
import CommonStyles from '../common/commonStyles'
import CommonLables from '../common/commonLabel'
import {Filter} from '../../components/filter/filter'
import {themes} from '../../themes/themes'

export class ProfileManagement extends Component {
  render() {
    const columns = [
      {
        title: <b>{CommonLables.CUSTOMER_ID}</b>,
        render(val) {
          return <p style={CommonStyles.grayText}>{val.customerId}</p>
        },
      },
      {
        title: <b style={CommonStyles.nameHeader}>{CommonLables.NAME}</b>,
        render(val) {
          return (
            <div style={CommonStyles.nameField}>
              <img
                style={CommonStyles.imageStyle}
                alt={CommonLables.ALTERNATE_PIC}
                src={val.profilePic ? val.profilePic : themes.default_user}
              />
              <p style={CommonStyles.nameStyle}>{val.name}</p>
            </div>
          )
        },
      },
      {
        title: <b>{CommonLables.USER}</b>,
        render(val) {
          return <p style={CommonStyles.grayText}>{val.role}</p>
        },
      },
      {
        title: <b>{CommonLables.DATE}</b>,
        render(val) {
          return <p style={CommonStyles.grayText}>{val.date}</p>
        },
      },
      {
        title: <b>{CommonLables.EMAIL_ID}</b>,
        render(val) {
          return <p style={CommonStyles.grayText}>{val.email}</p>
        },
      },
      {
        title: <b>{CommonLables.UPDATE_PASSWORD}</b>,
        render(val) {
          return (
            <div>
              <Button style={CommonStyles.approveBotton}>{CommonLables.UPDATE}</Button>
            </div>
          )
        },
      },
      {
        title: <b>{''}</b>,
        render(val) {
          return (
            <div>
              <Icon
                type={CommonLables.EDIT_ICON}
                theme={CommonLables.THEME}
                style={CommonStyles.editIconStyle}
              />
            </div>
          )
        },
      },
    ]
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        this.setState({seletedId: selectedRows})
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    }
    return (
      <div>
        <div style={CommonStyles.upperView}>
          <p style={CommonStyles.top_titleTextStyle}>{CommonLables.PROFILE_TITLE}</p>
          <div style={CommonStyles.top_monthFilterView}>
            <Filter />
          </div>
        </div>
        <Table
          className="tableClass"
          columns={columns}
          rowSelection={rowSelection}
          dataSource={DATA.sampleData}
        />
      </div>
    )
  }
}

export default ProfileManagement

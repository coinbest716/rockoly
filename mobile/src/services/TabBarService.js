/** @format */
import BaseService from './BaseService'

export const TAB_EVENTS = {
  SHOW_INFO: 'TAB/SHOW_INFO',
}

class TabBarService extends BaseService {
  constructor() {
    super()
    this.tabData = {}
  }

  showInfo = () => {
    this.emit(TAB_EVENTS.SHOW_INFO, {showInfoIcon: true})
  }

  hideInfo = () => {
    this.emit(TAB_EVENTS.SHOW_INFO, {showInfoIcon: false})
  }
}

const instance = new TabBarService()
export default instance

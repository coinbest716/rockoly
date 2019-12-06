/** @format */
import BaseService from './BaseService'

class SampleService extends BaseService {
  constructor() {
    super()
    console.log('debugging this', this)
  }

  getData() {}
}

const instance = new SampleService()
export default instance

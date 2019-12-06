/** @format */

export const fetchTrackdata = {
  pendingPayment: trackingData => {
    return new Promise((resolve, reject) => {
      let count = 0
      const temp = []
      trackingData.forEach((val, index) => {
        if (index < 8 && index !== 3 && index !== 4 && index !== 5) {
          count++
          temp.push(val)
        } else {
          count++
        }
        if (count === trackingData.length) {
          resolve(temp)
        }
      })
    })
  },

  //Customer requested or chef accepted
  customerRequested: trackingData => {
    return new Promise((resolve, reject) => {
      let count = 0
      const temp = []
      trackingData.forEach((val, index) => {
        if (index < 8 && index !== 3 && index !== 4 && index !== 5) {
          count++
          temp.push(val)
        } else {
          count++
        }
        if (count === trackingData.length) {
          resolve(temp)
        }
      })
    })
  },

  //Chef rejected
  chefRejected: trackingData => {
    return new Promise((resolve, reject) => {
      let count = 0
      const temp = []
      trackingData.forEach((val, index) => {
        if (
          val.trackOrderNo === 1 ||
          val.trackOrderNo === 2 ||
          val.trackOrderNo === 4 ||
          val.trackOrderNo === 11
        ) {
          count++
          temp.push(val)
        } else {
          count++
        }
        if (count === trackingData.length) {
          resolve(temp)
        }
      })
    })
  },

  //customer Cancelled
  customerCancelled: trackingData => {
    return new Promise((resolve, reject) => {
      let count = 0
      const temp = []
      trackingData.forEach((val, index) => {
        if (
          val.trackOrderNo === 1 ||
          val.trackOrderNo === 2 ||
          val.trackOrderNo === 3 ||
          val.trackOrderNo === 5 ||
          val.trackOrderNo === 11
        ) {
          count++
          temp.push(val)
        } else {
          count++
        }
        if (count === trackingData.length) {
          resolve(temp)
        }
      })
    })
  },

  //Chef Cancelled
  chefCancelled: trackingData => {
    return new Promise((resolve, reject) => {
      let count = 0
      const temp = []
      trackingData.forEach((val, index) => {
        if (
          val.trackOrderNo === 1 ||
          val.trackOrderNo === 2 ||
          val.trackOrderNo === 3 ||
          val.trackOrderNo === 6 ||
          val.trackOrderNo === 11
        ) {
          count++
          temp.push(val)
        } else {
          count++
        }
        if (count === trackingData.length) {
          resolve(temp)
        }
      })
    })
  },

  completedByAnyOne: trackingData => {
    return new Promise((resolve, reject) => {
      let count = 0
      const temp = []
      trackingData.forEach((val, index) => {
        if (
          ((val.trackOrderNo === 4 || val.trackOrderNo === 5 || val.trackOrderNo === 6) &&
            val.updatedAt) ||
          (val.trackOrderNo === 1 ||
            val.trackOrderNo === 2 ||
            val.trackOrderNo === 3 ||
            val.trackOrderNo === 7 ||
            val.trackOrderNo === 8)
        ) {
          count++
          temp.push(val)
        } else {
          count++
        }
        if (count === trackingData.length) {
          resolve(temp)
        }
      })
    })
  },

  //Both completed
  bothCompleted: trackingData => {
    return new Promise((resolve, reject) => {
      let count = 0
      const temp = []
      trackingData.forEach(val => {
        if (
          ((val.trackOrderNo === 4 || val.trackOrderNo === 5 || val.trackOrderNo === 6) &&
            val.updatedAt) ||
          (val.trackOrderNo === 1 ||
            val.trackOrderNo === 2 ||
            val.trackOrderNo === 3 ||
            val.trackOrderNo === 7 ||
            val.trackOrderNo === 8 ||
            val.trackOrderNo === 10)
        ) {
          count++
          temp.push(val)
        } else {
          count++
        }
        if (count === trackingData.length) {
          resolve(temp)
        }
      })
    })
  },
}

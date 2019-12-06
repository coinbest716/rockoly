/** @format */
import React from 'react'
import {CONSTANTS} from '@common'

export const AuthContext = React.createContext({
  isLoggedIn: false,
  isChef: false,
  userRole: CONSTANTS.ROLE.CUSTOMER,
  currentUser: {},
  updateCurrentUser: () => {},
  logout: () => {},
  getProfile: () => {},
})

/**
 * Created by InspireUI on 17/02/2017.
 *
 * @format
 */

// customer tab icons
const ProfileIcon = require('@images/tab-icons/customer/profile.png')
const BookingHistoryIcon = require('@images/tab-icons/customer/booking_history.png')
const FavoriteChefIcon = require('@images/tab-icons/customer/favorite_chef.png')
const InboxIcon = require('@images/tab-icons/customer/inbox.png')
const FindChefIcon = require('@images/tab-icons/customer/find_chef.png')
// customer tab icons

// chef tab icons
const BookingRequestIcon = require('@images/tab-icons/chef/booking_request.png')
const PaymentsIcon = require('@images/tab-icons/chef/payments.png')
const SettingsIcon = require('@images/tab-icons/chef/settings.png')
const HomeIcon = require('@images/tab-icons/chef/home.png')
// chef tab icons

// banner
const chefBanner = require('@images/banner/kitchen.jpg')
const leaf = require('@images/banner/leaf.jpg')
const restaurant = require('@images/banner/restaurant.jpg')
const service = require('@images/banner/service.jpg')
const chef = require('@images/banner/chef.jpg')
// banner

// icons
const clearSearch = require('@images/icons/ic_clear_search.png')
const filterSearch = require('@images/icons/ic_filter_search.png')
const favIcon = require('@images/icons/icon-love.png')
const pdfIcon = require('@images/icons/pdfIcon.png')
const closeIcon = require('@images/icons/close_icon.png')
const tickIcon = require('@images/icons/tick_icon.png')
// icons

// common
const defaultChefProfile = require('@images/common-images/default_chef_profile.png')
const defaultAvatar = require('@images/common-images/default_avatar.jpg')
// common

// role
const chefRole = require('@images/role/chef_black.png')
const chefImage = require('@images/role/chef_white.png')
const customerRole = require('@images/role/customer_black.png')
const customerImage = require('@images/role/customer_white.png')
// role
// logo
const mainLogo = require('@images/logo/logo.png')
// logo

const Images = {
  customerTab: {
    ProfileIcon,
    BookingHistoryIcon,
    FavoriteChefIcon,
    InboxIcon,
    FindChefIcon,
  },
  chefTab: {
    BookingRequestIcon,
    PaymentsIcon,
    SettingsIcon,
    HomeIcon,
  },
  chef: {
    chefBanner,
    leaf,
    restaurant,
    service,
    chef,
  },
  icons: {
    clearSearch,
    filterSearch,
    favIcon,
    pdfIcon,
    closeIcon,
    tickIcon,
  },
  common: {
    defaultAvatar,
    defaultChefProfile,
  },
  logo: {
    mainLogo,
  },
  role: {
    chefRole,
    chefImage,
    customerImage,
    customerRole,
  },
}

export {Images}

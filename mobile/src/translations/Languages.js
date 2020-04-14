/** @format */

import LocalizedStrings from 'react-native-localization'

export default new LocalizedStrings({
  en: {
    appName: 'Rockoly',

    customerTab: {
      findChef: 'Find Chef',
      favoriteChef: 'Favorite Chef',
      bookingHistory: 'Booking History',
      account: 'Account',
      search: 'Search',
      saved: 'Saved',
      events: 'Events',
      profile: 'Profile',
    },
    chefTab: {
      home: 'Home',
      booking: 'Booking',
      payments: 'Payments',
      profile: 'Profile',
      settings: 'Settings',
      reservations: 'Reservations',
      calender: 'Calendar',
    },
    chefList: {
      SearchPlaceHolder: 'Search Chef by Location',
      cancel: 'Cancel',
      apply: 'Apply',
    },
    customerPreference: {
      title: 'Preferences',
      labels: {
        allergiesPlaceholder: 'Please specify any new allergies',
        dietryPlaceholder: 'Please specify new dietary restriction (s) if applicable.',
        kitchenEquipmentPlaceholder:
          'Please specify any additional kitchen equipment you might have.',
        save: 'Save',
        cuisinePlaceholder: 'Please specify any new cuisine',
        next: 'Next',
      },
      toast_messages: {
        allergiesMessage: 'Allergies saved',
        dietaryMessage: 'Dietary Restrictions Saved.',
        kitchenEquipmentMessage: 'Kitchen Equipment saved.',
      },
    },
    galleryAttachment: {
      title: 'Gallery & Attachment',
    },

    notification: {
      seenNotifications: 'Seen Notifications',
      markAll: 'Mark all as seen',
      unseenNotifications: 'Unread Notifications',
      clearAll: 'Clear All',
    },
    changePassword: {
      title: 'Change Password',
      buttonLabels: {
        changePassword: 'Reset Password',
      },
      reg_form_label: {
        firstName: 'First name',
        lastName: 'Last name',
        gender: 'Gender',
        dateOfBirth: 'Date of birth',
        mobileNumber: 'Mobile number',
        oldPassword: 'Current password',
        newpassword: 'New password',
        confirmPassword: 'Confirm password',
        email: 'Email',
        password_not_match: 'Password and confirm password does not match',
        password_sucsess: 'Password has been changed successfully',
        password_info: 'Password must contain atleast 6 characters',
        mob_info: 'OTP will be sent to this number',
        alert_title: 'Your password has been changed.',
        alert_message: 'You will be logout now. please login with new password. Thanks',
        error_change_password: 'There is an error on changing the password',
        error_reset_password: 'There is an error to reset the password',
        fill_form: 'Please fill-up the form',
      },
    },
    preRegister: {
      title: 'Pre Register',
    },
    forgetPassword: {
      title: 'Forgot Password',
      role: {
        chef: 'Chef',
        customer: 'Customer',
      },
      buttonLabels: {
        google: 'Google',
        facebook: 'Facebook',
        login: 'Login',
        signup: 'Signup',
        reset_password: 'Reset Password ',
        email: 'Email',
        password: 'Password',
        keep_me_logged_in: 'Keep me logged in ',
        or: 'OR',
        dont_have_account: `Don' t have account.`,
        click_here: 'Click here',
        not_a: 'Not a ',
        dot: '.',
        forgot_info: `Please enter your email address associated with your account. we will send you a link to reset password`,
      },
      alertMessage: {
        enter_field: 'Please enter the field',
        reset_link: 'Reset link hasbeen sent to your email',
        problem_link: 'There is an problem to sent the link',
      },
    },
    login: {
      title: 'Login',
      role: {
        chef: 'Chef',
        customer: 'Customer',
      },
      buttonLabels: {
        google: 'Google',
        facebook: 'Facebook',
        login: 'Login',
        signup: 'Signup',
        forgot_password: 'Forgot Password ?',
        email: 'Email',
        password: 'Password',
        keep_me_logged_in: 'Keep me logged in ',
        or: 'or',
        dont_have_account: `Don' t have account.`,
        click_here: 'Click here',
        not_a: 'Not a ',
        dot: '.',
        ok: 'OK',
      },
      loginAlertMessage: {
        fill_form: 'Please fill-up the form',
        incorrect: 'Incorrect password',
        account_notfound: 'Account not found',
        invalid_email: 'Invalid email',
        try_again: 'Error. Please try again later',
        login_error: 'Login Error',
        account_blocked: 'Sorry, Your account has been blocked by Admin.',
        account_not_exist:
          'This Account does not exists. please try to register with this Google/Facebook account',
        account_already_exist:
          'An account already exists with the same email address but different sign-in credentials',
      },
    },
    EmailVerification: {
      title: 'Email Verification',
      labels: {
        verified_msg: 'Your email has been verified.',
        enterOTP: 'Enter OTP',
        sentMsg: 'Please click on the button below to send the verification link: ',
        dontReceiveOTP: `Don't receive OTP`,
        clickHere: 'Click here',
        verify: 'Verify',
        email: 'Email',
        send_otp: 'Send Link',
        confirm: 'Confirm',
        next: 'Next',
      },
      emailAlertMessage: {
        otp_sent: 'Verfication link has been sent',
        otp_not_sent: 'Could not send OTP',
        email_empty: 'email cannot be empty',
        number_already_exist: 'Sorry, This email is already exists',
        verify_try_again: 'Sorry, Could not check this email. Please try again later.',
        number_verified: 'Email Verified',
        error: 'Error',
        error_number: 'Error on verifying email',
        enter_otp: 'Please enter OTP',
      },
    },
    OTPVerification: {
      title: 'Mobile Verification',
      labels: {
        verified_msg: 'Your mobile number has been verified.',
        otpVerify: 'OTP will be sent to this mobile number :',
        enterOTP: 'Enter OTP',
        sentMsg: 'OTP has been sent this mobile number : ',
        dontReceiveOTP: `Don't receive OTP`,
        clickHere: 'Click here',
        verify: 'Verify',
        mobile_number: 'Mobile Number',
        send_otp: 'Send OTP',
        change_number: 'Change Mobile number',
        next: 'Next',
      },
      otpAlertMessage: {
        otp_sent: 'OTP has been sent',
        otp_not_sent: 'Could not send OTP',
        number_empty: 'Mobile number cannot be empty',
        number_already_exist: 'Sorry, This mobile number is already exists',
        verify_try_again: 'Sorry, Could not check this mobile number. Please try again later.',
        number_verified: 'Mobile number verified successfully.',
        number_verified_auto: 'Mobile number auto verified successfully.',
        already_verified: 'Mobile number is already verified.',
        could_not_verify: 'Sorry, Could not verify the mobile number. Please try again later.',
        error: 'Error',
        error_number: 'Error on verifying the number',
        enter_otp: 'Please enter OTP',
      },
    },
    register: {
      title: 'Register',
      buttonLabels: {
        register: 'Register',
        google: 'Google',
        facebook: 'Facebook',
        ok: 'OK',
        or: 'Or',
      },
      reg_form_label: {
        firstName: 'First name',
        lastName: 'Last name',
        gender: 'Gender',
        dateOfBirth: 'Date of birth',
        mobileNumber: 'Mobile number',
        password: 'Password',
        confirmPassword: 'Confirm password',
        email: 'Email',
        inavl_email: 'Invalid email address',
        enter_email_info: 'Please enter your email address to continue.',
        password_not_match: 'Password and confirm password does not match',
        password_info: 'Password must contain atleast 6 characters',
        mob_info: 'OTP will be sent to this number',
        already_account: 'Already have account',
        click_here: 'Click Here',
      },
      reg_alrt_msg: {
        fill_form: 'Please fill-up the form',
        mail_already_exist: 'Sorry, This email address already exists',
        invalid_email: 'Sorry, You have entered invalid email address',
        num_already_exist: 'Sorry, This mobile number is already exists',
        email_num_exist: 'Sorry, This email and mobile number is already exists',
        try_again: 'Error. Please try again later',
        reg_error: 'Register Error',
        reg_success: 'Register success',
        account_exist:
          'Account already exists. please try to login with this Google/Facebook account',
        account_email_exist: 'Account already exists. please try to login',
        different_credential:
          'An account already exists with the same email address but different sign-in credentials',
        enter_email: 'Please enter the email address',
      },
    },
    bookingHistory: {
      accept: 'Accept',
      reject: 'Reject',
      cancel: 'Cancel',
      complete: 'Complete',
      edit: 'Edit',
      feedback: 'Feedback',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      no_bookings: 'No Booking Requests',
      transfer_failed: 'Transfer failed',
      complete_booking: 'You Complete a Booking after',
      no_booking_items: 'No Booking Request Items',
      tabs: {
        all: 'All',
        upcoming: 'Upcoming',
        completed: 'Completed',
        request: 'Requested a booking',
        accept: 'You accepted the booking',
        canceled: 'Canceled',
        rejected: 'Rejected',
        reviewed: 'Reviewed',
      },
      booking_his_alrt_msg: {
        exit_app: 'Exit App',
        exit_info: 'Are you sure want to exit the application?',
        show_more: 'show more',
        info: ' Info',
        cannot_cancel: 'Booking cannot to be cancelled',
        add_bank: 'Please add a new Bank/Account details in Manage Payments',
        sure_complete: 'Are you sure you want to complete this booking ?',
        cancel_request: 'Are you sure you want to cancel this request ?',
        reject_request: 'Are you sure you want to reject this request ?',
        accept_request: 'Are you sure you want to accept this request ?',
      },
    },
    manage_payment: {
      title: 'Payment Method',
      serviced_received: 'Payment received for services',
      manage_payment_lable: {
        connect_stripe: 'Connect stripe',
        ok: 'Ok',
        cancel: 'Cancel',
        star: '**** **** **** ',
        stripe_account: 'Stripe Account ID',
        default_account: 'Default Account',
        set_default: 'Set Default',
        bank_account: 'No Bank Account Details',
      },
      manage_payment_alrt_msg: {
        confirmation: 'Confirmation',
        delete_info: 'Are you sure want to delete this bank information ?',
      },
    },
    payment_history: {
      title: 'Payment History',
      payment_received: '* Payment received in account for accepted bookings',
      serviced_received: 'Payment received for services',
    },
    chef_profile: {
      title: 'Chef Profile',
      chef_profile_lable: {
        ok: 'Ok',
        experience: 'Experience',
        service_cost: 'Service cost',
        example_hours: '(Example: $20/hour)',
        business_hours: 'Business Hours',
        choose_specialization: 'Choose Specialization',
        set_availability: 'Set Availability',
        upload: 'UPLOAD DOCUMENTS',
        upload_info: 'Please upload your driver’s license or other relevant documents.',
        upload_gallery: 'UPLOAD IMAGES',
        show_gallery: 'Please upload pictures to showcase in your image gallery',
        social_media: 'Social Media Links',
        license: 'License',
        complete: 'Complete',
        choose_photo: 'Choose Photo',
        customer_booking_hours: 'Minimum number of hours customer can book',
      },
      chef_profile_alrt_msg: {
        confirmation: 'Confirmation',
        remove_document: 'Are you sure want to remove this Document?',
        remove_picture: 'Are you sure want to remove this picture?',
        cancel: 'Cancel',
        info: 'Info',
        inavalid_selection: 'Invalid file selection',
        select_image: 'Please select image file',
        cancel_image: 'User Cancelled Image Selection',
        warning: 'Warning',
        documents: 'Documents',
        file_type: 'Choose File Type',
        image: 'Images',
        kind_of_document: 'Which kind of documents do you want to upload ?',
        license: 'LICENSE',
        others: 'OTHERS',
        certificate: 'CERTIFICATE',
        cant_get_image: 'Cannot be get image',
        unable_attach_file: 'File Could not to be attached',
        unable_fetch_media: 'Unable to fetch media files',
        maximum_upload: 'Sorry, Maximum you can upload',
        upload_document: 'Please Upload document or pdf file',
      },
    },
    set_unavailability: {
      title: 'Set Unavailability',
      set_unavailability_lable: {
        select_valid_time: 'Please select a valid time',
        add_date: 'Please add your unavailability',
        select_date: 'Select Date',
        save: 'Save',
        ok: 'Ok',
        cancel: 'Cancel',
        add: 'Add',
      },
      set_unavailability_alrt_msg: {
        select: 'Select',
        error: 'Error',
        error_saving: 'Error on saving the unavailability',
        select_date: 'Please select the date',
        saved_unavailability: 'unavailability has been saved',
        delete_unavailability: 'unavailability date has been deleted',
        cant_delete: `Sorry couldn't delete the unavailability date`,
        confirmation: 'Confirmation',
        remove_date: 'Are you sure want to remove this date?',
      },
    },
    set_availability: {
      title: 'Set Availability',
      set_availability_lable: {
        info_text1: `Please provide your general availability.`,
        info_text: `Please provide your general availability.To update unavailable days use set unavailability option`,
        set_unavailability: 'Set Unavailability',
        select_valid_time: 'Start time should be less than end time',
        save: 'Save',
      },
      set_availability_alrt_msg: {
        availability_saved: 'Availability saved.',
        error: 'Error',
        vaild_time: 'Start time should be less than end time',
        error_saving: 'Error on saving the availability',
      },
    },
    stripe: {
      title: 'Connect stripe',
      stripe_alrt_msg: {
        bank_account: 'Bank account/card details have been saved',
        error_saving: 'Error on saving the bank details',
      },
    },
    basicEditProfile: {
      title: 'Profile',
      buttonLabels: {
        update: 'Update',
        save: 'Save',
        finish: 'Submit',
        next: 'Next',
        choose_photo: 'Choose Photo',
      },
      basic_edit_form_label: {
        salutation: 'Salutation',
        first_name: 'First Name',
        last_name: 'Last Name',
        gender: 'Gender',
        date_of_birth: 'Date of Birth (MM/DD/YYYY)',
        salutation_mr_value: 'MR', // stored format in backend -> MR, MISS & MRS
        salutation_ms_value: 'MISS',
        salutation_mrs_value: 'MRS',
        gender_male_value: 'MALE', // stored format in backend -> MALE & FEMALE
        gender_female_value: 'FEMALE',
        salutation_mr_label: 'Mr',
        salutation_ms_label: 'Ms',
        salutation_mrs_label: 'Mrs',
        gender_male_label: 'Male',
        gender_female_label: 'Female',
      },
      alert: {
        invalid_file_title: 'Invalid file selection',
        warning_title: 'Warning',
        info_title: 'Info',
        error_title: 'Error',
        invalid_file_format: 'Please select image file',
        cannot_get_image: 'Cannot be get image',
        attachment_fail: 'File could not to be attached',
        profile_upload_error: 'Sorry could not upload profile picture. Please try again later',
      },
      toast_message: {
        update_success: 'Profile picture saved.',
        update_profile_success: 'Profile details saved',
      },
    },
    bookingDetail: {
      title: 'Booking Detail',
      role: {
        chef: 'CHEF',
        customer: 'CUSTOMER',
        fromCustomer: 'From customer',
        fromChef: 'From chef',
      },
      labels: {
        reason: 'Reason',
        your_reason: 'Your Reason',
        booking_price: 'Booking Price',
        booking_Date: 'Booking Date',
        booking_time: 'Booking Time',
        booking_hours: 'Booking Hours',
        booking_dishes: 'Booking Dishes',
        booking_notes: 'Booking Notes',
        booking_status: 'Booking Status',
        completed: 'Completed',
        rejected_booking: 'Rejected Booking',
        accepted_booking: 'Accepted Booking',
        requested_booking: 'Requested Booking',
        bookingExperied: 'Booking Expired',
        awaiting: 'Awaiting For Chef',
        payment_pending: 'Payment Pending',
        reviewed: 'Reviewed',
        dot: '.',
        dollar: '$',
        complete_booking_after: 'You Complete a Booking after',
        refund_success: 'Refund Amount Success',
        refund_failed: 'Refund Amount Failed',
        booking_summary: 'Booking Summary',
        booking_no_of_people: 'Booking No of People',
        booking_allergy: 'Booking Allergies',
        other_allergy: 'Other Allergies',
        booking_kitchen_equipment: 'Booking Kitchen Equipments',
        other_kitchen_equipment: 'Other Kitchen Equipments',
        booking_dietary: 'Booking Dietary Restrictions',
        other_dietary: 'Other Dietary Restrictions',
        booking_store: 'Booking Store',
        other_store: 'Other Store',
        food_cost: 'Food Cost',
        complexity: 'Complexity',
        event_notes: 'Event Notes',
        payment_details: 'Payment Detail',
        payment_id: 'Payment Id',
        payment_status: 'Payment Status',
        amount: 'Amount',
        payment_date: 'Date',
        dish_notes: 'Dish Notes',
        request_additional_charge: 'Requested Additional Charges',
        request_price: 'Request Price',
        request_no_of_people: 'Request No of people',
        request_complexity: 'Request Complexity',
        request_additional_service: 'Request Additional service',
        request_additional_service_price: 'Request Additonal Price',
        additonal_chef_price: 'Additional Chef Price',
        additional_no_of_people: 'Additional no of people',
        request_amount: 'Requested Amount',
        complexity_changes: 'Complexity changes',
        extra_service_provided: 'Extra services provided',
        extra_services_amount: 'Extra services amount',
        total_amount: 'Total amount',
        total_pay: 'Total amount to pay',
        total_remaining_amount_pay: 'Total Remaining Amount To Pay',
        customer_booking_location: 'Booking Location',
        rockoly_payment_charge: 'Rockoly/Payment charges',
        serving_time: 'Serving Time',
        draft: 'Draft',
      },
      alerts: {
        transfer_failed: 'Transfer failed',
        you_rejected: ' You have rejected the booking',
        you_cancelled_booking: 'You have Cancelled Booking',
        booking_completed: 'Booking completed',
        you_accepted_booking: 'You have accepted the booking',
        you_requested_booking: 'You have requested the booking',
        cancelled_booking: 'Cancelled booking',
        info: 'Info',
        add_bank_detail: 'Please add a new Bank/Account details in Manage Payments',
        booking_cannot_be_cancelled: 'Booking cannot to be cancelled',
        refund_success: 'Refund amount success',
        refund_failed: 'Refund amount failed',
        price_calculation:
          'Do you have any changes in pricing calculation (no of guests, complexity, additional services) ?',
        request_amount: 'You requested amount',
        complete_message:
          'You have completed the booking. Admin will review and send you the booking amount',
      },
      types: {
        booking_type_complete: 'COMPLETE',
        booking_type_cancel: 'CANCEL',
        booking_type_reject: 'REJECT',
        booking_type_accept: 'ACCEPT',
        customer_requested: 'CUSTOMER_REQUESTED',
        chef_accepted: 'CHEF_ACCEPTED',
        amount_transfer_success: 'AMOUNT_TRANSFER_SUCCESS',
        amount_transfer_fail: 'AMOUNT_TRANSFER_FAILED',
        cancelled_by_customer: 'CANCELLED_BY_CUSTOMER',
        cancelled_by_chef: 'CANCELLED_BY_CHEF',
      },
      questions: {
        accept: 'Are you sure you want to accept this request?',
        reject: 'Are you sure you want to reject this request?',
        cancel: 'Are you sure you want to cancel this request?',
        complete: 'Are you sure you want to complete this booking?',
      },
    },
    booking_History: {
      title: 'Booking History',
      ok: 'Ok',
      buttonLabels: {
        submit: 'Submit',
        empty_data_message: 'No Booking Items',
        complete_booking_after: 'You complete a booking after',
        from_date: 'From Date',
        to_Date: 'To Date',
        select_status: 'Select Store',
        selectStatus: 'Select Status',
        previous: 'Prev',
        next: 'Next',
        today: 'Today',
        upcoming: 'Upcoming',
        past: 'Past',
        completed: 'Completed',
        request: 'Requested a booking',
        accept: 'You accepted the booking',
        payment_pending: 'Payment pending',
        draft: 'Draft',
        transfer_failed: 'Transfer failed',
        customer_accept: 'Chef accepted the booking',
        awaiting: 'Awaiting for chef',
        cancelled: 'Cancelled',
        rejected: 'Rejected',
        requested_amount: 'Requested amount',
        accept_booking: 'Accepted',
        reviewed: 'Reviewed',
        future: 'Future',
      },
      questions: {
        accept: 'Are you sure you want to accept this request?',
        reject: 'Are you sure you want to reject this request?',
        cancel: 'Are you sure you want to cancel this request?',
        complete: 'Are you sure you want to complete this booking?',
      },
      types: {
        booking_type_complete: 'COMPLETE',
        booking_type_cancel: 'CANCEL',
        booking_type_reject: 'REJECT',
        booking_type_accept: 'ACCEPT',
        customer_requested: 'CUSTOMER_REQUESTED',
        chef_accepted: 'CHEF_ACCEPTED',
        amount_transfer_success: 'AMOUNT_TRANSFER_SUCCESS',
        amount_transfer_fail: 'AMOUNT_TRANSFER_FAILED',
        cancelled_by_customer: 'CANCELLED_BY_CUSTOMER',
        cancelled_by_chef: 'CANCELLED_BY_CHEF',
      },
      alerts: {
        info_title: 'Info',
        add_account_details: 'Please add a new Bank/Account details in Manage Payments',
        booking_cannot_cancel: 'Booking cannot to be cancelled',
        eventEnd: `Please complete the booking after the event has ended.`,
        eventEdit: `Please edit the booking after the event has started.`,
        cancel_time_error: 'Error on getting the cancel time',
      },
    },
    bookingModal: {
      labels: {
        booking_dishes: 'Booking Dishes',
        blocked_time: 'Blocked Time',
      },
      alert: {
        error: 'Please Enter Reason',
        select_time: 'Please select a valid time',
      },
      placeholders: {
        reason: 'Reason',
        showIngreidents:
          'Please Enter Ingredients needed for the dishes. It will be displayed to customer, Thanks',
      },
    },
    CardManagement: {
      title: 'Payment methods',
      addBtnText: 'Add Card',
      card_secret_code: '**** **** **** ',
      empty: 'No Cards',
      alert: {
        confirmation_title: 'Confirmation',
        delete: 'Are you sure want to delete this card information?',
      },
    },
    chefProfile: {
      title: 'Profile',
      labels: {
        top_pro: 'New Chef',
        master: 'Master Chef',
        high_in_demand: 'High in Demand',
        description: 'Description',
        cuisine_types: 'Cuisine Types',
        additional_service: 'Additional Service & Price',
        dish_types: 'Dish Specialty',
        check_availability: 'CHECK AVAILABILITY',
        set_availability: 'SET AVAILABILITY',
        base_rate: 'Base Rate',
        gratuity: 'Gratuity',
        additionalPrice: 'Each guest an additional X your base rate',
        discount: 'Discount for each guest after',
        noofguests: 'Number of Guests',
        business_hours: 'Business Hours',
        work_gallery: 'Work Gallery',
        rating_and_review: 'Rating & Review',
        continue: 'Click to continue...',
        years_in_business: 'Year(s) in business',
        distance_before: ' can travel up to ',
        distance_after: ' from ',
        cuisines_empty: 'No Cusines',
        dishes_empty: 'No Dishes',
        please_login: 'Please Login/Register to book chef',
        no_data: 'No Data',
        daily: 'Daily',
        to: 'to',
        minimum_booking_hours: 'Minimum Booking Hours',
        awards: 'Awards',
        certificate: 'Certifications',
        no_certificate: 'No Certificates',
        no_service: 'No services',
        work_experience: 'Work Experience',
        complexity: 'Complexity',
        no_complexity: 'No Complexity',
        price: 'Price',
        profile: 'Profile',
      },
      toast: {
        continue_see_profile: 'Continue seeing the chef profile...',
        sameUserAlert: `You can't able to book this chef`,
      },
    },
    feedback: {
      title: 'Feedback',
      placeholders: {
        review: 'Type your review here',
      },
      label: {
        compliment: 'Give a Compliment',
        submit: 'Submit',
      },
    },
    filter: {
      title: 'Filter',
      labels: {
        clear_filter: 'Clear Filters',
        price: 'Price',
        rating: 'Rating',
        dish_type: 'Dish Specialty',
        cuisine_type: 'Cuisine type',
        date: 'Date of the event',
        min_price: 'Min Price/Hour',
        max_price: 'Max Price/Hour',
        experience: 'Experience',
        above: '& above',
        select_dish: 'Select Dish(es)',
        select_cuisine: 'Select Cuisine(s)',
        apply: 'Apply',
        cancel: 'Cancel',
        search: 'Search Items...',
      },
    },
    NotificationSettings: {
      title: 'Notification',
      options: {
        push_notification: 'Push Notification',
      },
    },
    notifications: {
      title: 'Notifications',
      alert: {
        mark_alert: 'Are you sure want to mark all unread notifications as seen ?',
        clear_alert: 'Are you sure want to clear all seen notifications ?',
        login_alert: 'Please login to see your Notification.',
      },
      labels: {
        notification_empty: 'No Notifications',
      },
    },
    setLocation: {
      title: 'Home Address',
      location: 'Location',
      homeAddress: 'Home address',
      questions: {
        distance: 'How much distance can you travel?',
      },
      alert: {
        error: 'Error on saving the location',
        error_title: 'Error',
        info_title: 'Info',
        userDined: 'User denied access to location services.',
        allow_location: 'Please allow location permission',
        fetch_location_error: 'Unable to fetch current location',
        fill_all: 'Please fill all fields',
        error_location: "Sorry, We can't find the location.",
        miles_error:
          'Sorry we could not calculate distance between chef and your location, Please check your location whether its around the chef location.',
        use_GPS:
          'Use the GPS location or search autocomplete. Then only we are able to fetch latitude and longitude of your location. Thanks',
      },
      toast_messages: {
        save: 'Location saved.',
      },
      placeholders: {
        searchtxt: 'Search with city, post code',
        addresstxt: 'Apt, Suite. (optional)',
        localitytxt: 'Street Address',
        zipcodetxt: 'Zip Code',
        distancetxt: 'Distance (miles)',
        city: 'City',
        state: 'State',
        country: 'Country',
      },
      labels: {
        after_booking: 'This will be shown to customer after the booking',
        before_booking: 'This will be shown to customer even before booking',
        save: 'Save',
        next: 'Next',
      },
    },
    bookNow: {
      title: 'Book Now',
      labels: {
        dishes: 'Dishes',
        desired_dishes: 'Desired Dishes',
        select_dish_items: 'Select Dish Items',
        request_notes: 'Booking Request Notes',
        notes_placholder:
          'Please enter dish names you wanna to cook. It will be displayed to chef and he/she may reply with list of ingredients. Thanks',
        booking_details: 'Booking Details',
        booking_time: 'Booking Time',
        booking_date: 'Booking Date',
        service_cost: 'Chef Service Cost',
        service_charge: 'Service charge',
        ServingTime: 'Serving Time',
        percentage: '%',
        total_cost: 'Total Cost',
        dollar: '&',
        per_hour: 'per hour',
        payment_details: 'Payment Details',
        add_card: 'Add New Card',
        book_now: 'Book Now',
        secret_code: '**** **** ****',
        no_review: 'New Chef',
        complexity: 'Complexity',
        no_of_guests: 'No of guests',
        price_calculate: 'Calculation',
        additional_services: 'Additional services',
        pay_now: 'Pay Now',
        billing_details: 'Billing Details',
        pricing_details: 'Price Details',
        request_price: 'Request Price Details',
      },
      alert: {
        no_booking_data: 'No booking data',
        commision_percentage: 'Error on getting the commission percentage',
        select_card: 'Please select the card',
        could_not_proceed: 'Sorry Stripe customer ID is blank. Could not proceed booking',
        confirm_booking_title: 'Confirm Booking',
        confirm_booking_alert: 'Are you sure want to book this chef',
        booking_failed_title: 'Booking failed',
        booking_failed_alert: 'Sorry could not book the chef. Please try again later.',
        confirm_pay_title: 'Confirm Pay',
        confirm_pay_alert: 'Are you sure want to pay extra amount to this chef',
      },
    },
    book: {
      labels: {
        book_price: 'Book Price',
        book: 'Book',
        allergy: 'Select Allergy',
        dietary: 'Select Dietary Restrictions',
        kitchenEquipment: 'Select Kitchen Equipment',
        request: 'Request Price',
        next: 'Next',
        request_additional_charges: 'Request Additional Charges',
        book_location: 'Booking Location',
        pricing_calculator: 'Pricing Calculator',
      },
      toast_messages: {
        requestAmount: 'Requested Amount Successfully',
        pay_request_amount: 'Paid Requested Amount Successfully',
      },
    },
    checkAvailability: {
      title: 'Check Availability',
      role: {
        chef: 'Chef',
        customer: 'Customer',
      },
      buttonLabels: {
        available: 'AVAILABLE',
        not_available: 'NOT_AVAILABLE',
        booking_date: 'Booking Date',
        price_per_hour: 'Price/Hour',
        available_time: 'Available Time',
        selected_time: 'Selected Time',
        total_hours: 'Total Hours',
        chef_service_cost: 'Chef Service Cost',
        continue_booking: 'Continue Booking',
        or: 'OR',
        click_here: 'Click here',
        not_a: 'Not a ',
        dot: '.',
        colon: ':',
        dollar: '$',
        select_valid_time: "Please select serving time during chef's available hours",
        select_current_date_valid_time: 'Please select a serving time in the future',
        minimum_booking_hours: 'Minimum Booking Hours',
        booked_time: 'Booked Time',
        next: 'Next',
        blocked_time: 'Blocked Time',
        serving_time: 'Serving Time',
        booked_time_message: 'Chef will suggest times needed on site upon accepting the request.',
        selected_time_message: 'Time the food will be served.',
      },
      alerts: {
        select_time: 'Please select a valid time. Minutes should be 0 or 30',
        not_available_on_date: 'Sorry chef not available on selected date',
        not_available_on_time: 'Sorry chef not available on selected time',
        already_booked: 'Sorry chef already booked on selected date/time',
        try_again: 'Sorry could not check chef availablity. Please try again later',
        error: 'Sorry Error on checking the availability',
        info_title: 'Info',
      },
    },
    ChefList: {
      title: 'Chef List',
      role: {
        chef: 'Chef',
        customer: 'Customer',
      },
      buttonLabels: {
        no_reviews: 'New Chef',
        no_name: 'No Name',
        no_location: 'No Location',
        no_price: 'No Price',
        or: 'OR',
        dot: '.',
        colon: ':',
        dollar: '$',
        chef_empty_msg: 'No chefs found',
        above: '& above',
        per_hour: '/Hour',
        cuisine: 'Cuisine',
        distance_statement: 'Chef',
      },
      alerts: {
        exit_title: 'Exit App',
        exit: 'Are you sure want to exit the application?',
        location_permission: 'Please Allow Location Permission',
        login: 'Please Login',
        not_fetch_location: 'Unable to fetch Current Location',
        info_title: 'Info',
        userDined: 'User denied access to location services.',
      },
      placeholders: {
        search: 'Search with city, post code',
      },
    },
    Customer_Payment_History: {
      title: 'Payment History',
      role: {
        chef: 'Chef',
        customer: 'Customer',
      },
      buttonLabels: {
        received_statement: 'Payment received for services',
        no_payments_message: 'No Payment history found',
        or: 'OR',
        dot: '.',
        colon: ':',
        dollar: '$',
        paid: 'Payment done for booking',
        refund: 'Refund payment for this booking ',
        failed: 'Payment failed for booking',
      },
    },
    customerProfile: {
      title: 'Account',
      login_or_register: 'Login/Register',
      label: {
        login: 'Login',
        register: 'Register',
        submit_profile: 'Submit for review',
        submitted_for_review: 'Submitted for review',
        profile_verified: 'Your profile has been verified',
      },
      options: {
        gallery: 'Gallery',
        set_location: 'Home Address',
        email: 'Email Verification',
        manage_payments_methods: 'Manage payment methods',
        customer_profile: 'Preferences',
        allergies: 'Allergies',
        license: 'Documents',
        dietary: 'Dietary Restrictions',
        equipment: 'Kitchen Equipment',
        cuisine: 'Cuisines',
        logout: 'Logout',
        emailVerification: 'Verify Email',
        emailVerified: 'Email Verified',
        logout_confirm: 'Are you sure want to logout ?',
        booking_history: 'Booking History',
        payment_history: 'Payment History',
        profile_setup: 'Chef Profile',
        set_availability: 'Set availability',
        verify_mob: 'Verify Mobile number',
        verified: 'Mobile number Verified',
        gallery_Attachment: 'Gallery & Attachment',
        basic_profile: 'Profile',
        filter: 'Filter',
        change_password: 'Change Password',
        aboutus: 'Support',
        legal: 'Legal',
        contactus: 'Contact Us',
        terms: 'Terms and Policy',
        feedback: 'Feedback',
        switch_to_chef: 'Switch to Chef',
        switch_to_customer: 'Switch to Customer',
        notification_settings: 'Notification Settings',
        booking_notes_list: 'Booking Notes',
        inbox: 'Inbox',
        rate_service: 'Rate Service',
        option_list: 'Additional Services',
        intro_message: 'Intro Message',
        chef_experience: 'Specialties / Experience',
        complexity: 'Complexity',
        awards: 'Awards',
        profile_Pic: 'Profile Picture',
        rate: 'Rate',
        account: 'Account Settings',
        chefProfile: 'Chef Profile',
        pricing: 'Pricing',
        priceCal: 'Price Calculator',
        service: 'Service',
        number_of_guests: 'Number of guests',
      },
      alert: {
        error_title: 'Error',
        error_1: 'Sorry, Could not submit profile for review. please try again later.1',
        error_2: 'Sorry, Could not submit profile for review. please try again later.2',
        submit_profile_title: ' Ready to submit your profile for review? ',
        make_sure_details: 'You will be notified of your registration status within 48 hours.',
        complete_profile_title: 'Please complete your profile and try to submit',
        complete_profile_alert: 'Please Fill up the all details',
        confirmation: 'Are you sure want to',
        could_not_switch_account: 'Could not Switch Account',
        try_again_to_switch: 'Sorry, Could not switch account. please try again later',
        account_blocked: 'Sorry, Your Chef account has been blocked by Admin.',
        title: 'Blocked',
        email_or_mobile_veriified_title: 'Verification',
        email_or_mobile_veriified_error: 'Please verify both email address and mobile number',
      },
      messages: {
        submited_for_review_msg:
          'Thank you for submitting profile with us, admin will verify and approve your account within 48 hours.',
        review_pending_msg: `Please make sure your email and mobile have been verified and submit your profile for administrative review. You will be approved within 48 hours and start showing up in the customer searches.`,
        review_rejected_msg: 'Sorry, Your profile is rejected.',
      },
    },
    FavouriteChef: {
      title: 'Favorite Chefs',
      options: {
        no_chefs: 'No favorite chefs found',
        no_reviews: 'New Chef',
        no_name: 'No Name',
        no_location: 'No Location',
        no_price: 'No Price',
        or: 'OR',
        dot: '.',
        colon: ':',
        dollar: '$',
        chef_empty_msg: 'No favorite chefs found',
      },
    },
    searchLocation: {
      title: 'Search Location',
      buttonLabels: {
        search: 'Search',
        allow_ok: 'Ok',
        allow_cancel: 'Cancel',
        your_location: 'Your Location',
        message_info:
          'By entering Search with city, post code you can browse chefs in your location.',
        placeholder: 'Search with city, post code',
      },
      alerts: {
        allow_permission_title: 'Allow customer to access this device location',
        allow_location: 'Please Allow Location permission',
        not_fetch_location: 'Unable to fetch current location',
        userDined: 'User denied access to location services.',
      },
    },
    rateService: {
      placeholderLabel: {
        base_rate: 'Rate',
      },
      btnLabel: {
        save: 'Save',
      },
    },
    optionList: {
      placeholderLabel: {
        gratutity: 'Gratutity (%)',
        minimum: 'Minimum',
        maximum: 'Maximum',
        discount: 'Discount (%)',
        person: 'Person',
        guestCount: 'Guest',
        price: 'Price',
      },
      radio_form_label: {
        yes_label: 'Yes',
        yes_value: 'Yes',
        no_label: 'No',
        no_value: 'No',
      },
      btnLabel: {
        save: 'Save',
      },
    },
    complexity: {
      btnLabel: {
        save: 'Save',
        next: 'Next',
        agree: 'I Agree',
      },
    },
    chefExperience: {
      btnLabel: {
        save: 'Save',
      },
    },
    awards: {
      btnLabel: {
        save: 'Save',
      },
    },
    home: {
      bankAlert: {
        no_bank_account: 'Please setup banking account',
      },
      bookingRequests: {
        no_request: 'No Requests',
      },
      reviews: {
        no_review: 'No Reviews',
      },
      stats: {
        no_stats: 'No Stats',
      },
      reservations: {
        no_reservations: 'No Reservations',
      },
    },
  },
})

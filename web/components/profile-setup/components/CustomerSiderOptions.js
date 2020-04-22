export const profileSetupCustomerMenu = [
  {
    title: 'Basic Profile',
    key: 0,
  },
  {
    title: 'Mobile Number',
    key: 1,
  },
  {
    title: 'Email address',
    key: 2,
  },
  {
    title: 'Home Address',
    key: 3,
  },
  {
    title: 'Allergies',
    key: 4,
  },
  {
    title: 'Dietary Restrictions',
    key: 5,
  },
  {
    title: 'Kitchen Equipment',
    key: 6,
  },
];

export const profileSetupChefNestedMenu = [
  {
    title: 'Profile',
    key: 'pk',
    subMenu: [
      {
        title: 'Account Settings',
        key: 'psub1',
        subMenuItem: [
          {
            title: 'Personal Information',
            key: 'psub1Menu1',
            nestedMenu: {
              nestedMenuItem: [
                {
                  title: 'Edit Personal info',
                  key: 0,
                },
                {
                  title: 'Edit Home Address',
                  key: 'psub1Menu1Nes2',
                },
              ],
            },
          },
          {
            title: 'Payments and payouts',
            key: 'psub1Menu2',
            nestedMenu: {
              nestedMenuItem: [
                {
                  title: 'Edit you payout method',
                  key: 'psub1Menu2Nes2',
                },
              ],
            },
          },
          {
            title: 'Notifications',
            key: 'psub1Menu3',
            nestedMenu: {
              nestedMenuItem: [
                {
                  title: 'Notification + Notification Settings',
                  key: 'psub1Menu3Nes3',
                },
              ],
            },
          },
          {
            title: 'Mobile Verified',
            key: 'psub1Menu4',
          },
          {
            title: 'Email Verified',
            key: 'psub1Menu5',
          },
          {
            title: 'Your guidebook',
            key: 'psub1Menu6',
          },
        ],
      },
      {
        title: 'Chef Profile',
        key: 'psub2',
        subMenuItem: [
          {
            title: 'Basics',
            key: 'psub2Menu1',
            nestedMenu: {
              nestedMenuItem: [
                {
                  title: 'Experience,Specialities,Dishes',
                  key: 'psub2Menu1Nes1',
                },
              ],
            },
          },
          {
            title: 'Availability',
            key: 'psub2Menu2',
          },
          {
            title: 'Gallery',
            key: 'psub2Menu3',
          },
          {
            title: 'Documents',
            key: 'psub2Menu4',
          },
        ],
      },
      {
        title: 'Pricing',
        key: 'psub3',
        subMenuItem: [
          {
            title: 'Price Calculator  ',
            key: 'psub3Menu1',
            nestedMenu: {
              nestedMenuItem: [
                {
                  title: 'Edit add play',
                  key: 'psub3Menu1Nes1',
                },
              ],
            },
          },
          {
            title: 'Base Price',
            key: 'psub3Menu2',
          },
          {
            title: 'Complexity',
            key: 'psub3Menu3',
          },
          {
            title: 'Additional Services',
            key: 'psub3Menu4',
          },
        ],
      },
      {
        title: 'Switch to Customer',
        key: 'psub4',
      },
      {
        title: 'Support',
        key: 'psub5',
        subMenuItem: [
          {
            title: 'Contact Rockoly Support',
            key: 'psub5Menu1',
            nestedMenu: {
              nestedMenuItem: [
                {
                  title: 'TBA',
                  key: 'psub5Menu1Nes1',
                },
              ],
            },
          },
        ],
      },
      {
        title: 'Legal',
        key: 'psub6',
        subMenuItem: [
          {
            title: 'Terms Of Service',
            key: 'psub6Menu1',
          },
          {
            title: 'Privacy Policy',
            key: 'psub6Menu2',
          },
        ],
      },
      {
        title: 'Logout',
        key: 'psub7',
      },
    ],
  },
];

export const profileSetupChefNestedMenuKeys = [
  {
    key: 'psub1Menu1Nes1',
    index: 0,
  },
  {
    key: 'psub1Menu1Nes2',
    index: 3,
  },
  {
    key: 'psub1Menu2Nes2',
    index: 99,
  },
  {
    key: 'psub1Menu3Nes3',
    index: 99,
  },
  {
    key: 'psub1Menu4',
    index: 1,
  },
  {
    key: 'psub1Menu5',
    index: 2,
  },
  {
    key: 'psub1Menu6',
    index: 99,
  },
  {
    key: 'psub2Menu1Nes1',
    index: 8,
  },
  {
    key: 'psub2Menu2',
    index: 10,
  },
  {
    key: 'psub2Menu3',
    index: 11,
  },
  {
    key: 'psub2Menu4',
    index: 12,
  },
  {
    key: 'psub3Menu1Nes1',
    index: 4,
  },
  {
    key: 'psub3Menu2',
    index: 5,
  },
  {
    key: 'psub3Menu3',
    index: 7,
  },
  {
    key: 'psub3Menu4',
    index: 99,
  },
  {
    key: 'psub4',
    index: 99,
  },
  {
    key: 'psub5Menu1Nes1',
    index: 99,
  },
  {
    key: 'psub6Menu1',
    index: 99,
  },
  {
    key: 'psub6Menu2',
    index: 99,
  },
  {
    key: 'psub7',
    index: 99,
  },
];

export const profileSetupCustomerNestedMenu = [
  {
    title: 'Profile',
    key: 'pk',
    subMenu: [
      {
        title: 'Account Settings',
        key: 'psub1',
        subMenuItem: [
          {
            title: 'Edit Personal info',
            key: 'psub1Menu1Nes1',
          },
          {
            title: 'Edit Home Address',
            key: 'psub1Menu1Nes2',
          },
          {
            title: 'Payments and payouts',
            key: 'psub1Menu2',
            nestedMenu: {
              nestedMenuItem: [
                {
                  title: 'Edit you payout method',
                  key: 'psub1Menu2Nes2',
                },
              ],
            },
          },
          {
            title: 'Notifications',
            key: 'psub1Menu3',
          },
          {
            title: 'Mobile Verified',
            key: 'psub1Menu4',
          },
          {
            title: 'Email Verified',
            key: 'psub1Menu5',
          },
          {
            title: 'Your guidebook',
            key: 'psub1Menu6',
          },
        ],
      },
      {
        title: 'Customer Profile',
        key: 'psub2',
        subMenuItem: [
          {
            title: 'Allergies',
            key: 'psub2Menu1',
          },
          {
            title: 'Dietary Restriction',
            key: 'psub2Menu2',
          },
          {
            title: 'Kitchen Equipments',
            key: 'psub2Menu3',
          },
        ],
      },
      // {
      //   title: 'Pricing',
      //   key: 'psub3',
      //   subMenuItem: [
      //     {
      //       title: 'Price Calculator  ',
      //       key: 'psub3Menu1',
      //       nestedMenu: {
      //         nestedMenuItem: [
      //           {
      //             title: 'Edit add play',
      //             key: 'psub3Menu1Nes1',
      //           },
      //         ],
      //       },
      //     },
      //     {
      //       title: 'Base Price',
      //       key: 'psub3Menu2',
      //     },
      //     {
      //       title: 'Complexity',
      //       key: 'psub3Menu3',
      //     },
      //     {
      //       title: 'Additional Services',
      //       key: 'psub3Menu4',
      //     },
      //   ],
      // },
      {
        title: 'Switch to Chef',
        key: 'psub4',
      },
      {
        title: 'Others',
        key: 'psub5',
        subMenuItem: [
          {
            title: 'Change Password',
            key: 'psub5Menu1',
          }, {
            title: 'Support',
            key: 'psub5Menu2'
          }, {
            title: 'Legal',
            key: 'psub5Menu3',
            nestedMenu: {
              nestedMenuItem: [
              {
                title: 'Terms Of Service',
                key: 'psub6Menu1',
              },
              {
                title: 'Privacy Policy',
                key: 'psub6Menu2',
              },
            ],
          }
          }
        ],
      },
      // {
      //   title: 'Legal',
      //   key: 'psub6',
      //   subMenuItem: [
      //     {
      //       title: 'Terms Of Service',
      //       key: 'psub6Menu1',
      //     },
      //     {
      //       title: 'Privacy Policy',
      //       key: 'psub6Menu2',
      //     },
      //   ],
      // },
      {
        title: 'Logout',
        key: 'psub7',
      },
    ],
  },
];

export const profileSetupCustomerNestedMenuKeys = [
  {
    key: 'psub1Menu1Nes1',
    index: 0,
  },
  {
    key: 'psub1Menu1Nes2',
    index: 3,
  },
  {
    key: 'psub1Menu2Nes2',
    index: 7,
  },
  {
    key: 'psub1Menu3',
    index: 8,
  }, {
    key: 'psub1Menu4',
    index: 1,
  }, {
    key: 'psub1Menu5',
    index: 2,
  },

  {
    key: 'psub1Menu6',
    index: 9,
  },
  {
    key: 'psub2Menu1',
    index: 4,
  },
  {
    key: 'psub2Menu2',
    index: 5,
  },
  {
    key: 'psub2Menu3',
    index: 6,
  },
  {
    key: 'psub5Menu2',
    index: 12,
  },
  {
    key: 'psub3Menu1Nes1',
    index: 4,
  },
  {
    key: 'psub3Menu2',
    index: 5,
  },
  {
    key: 'psub3Menu3',
    index: 7,
  },
  {
    key: 'psub3Menu4',
    index: 99,
  },
  {
    key: 'psub4',
    index: 10,
  },
  {
    key : 'psub5Menu1',
    index : 11,
  },
  {
    key: 'psub5Menu1Nes1',
    index: 99,
  },
  {
    key: 'psub6Menu1',
    index: 13,
  },
  {
    key: 'psub6Menu2',
    index: 14,
  },
  {
    key: 'psub7',
    index: 15,
  },
];

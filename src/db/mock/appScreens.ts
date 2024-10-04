import { AppScreens, NodeData } from "@/types/node/node";

export default function getMockData() {
  return mockData2;
}

const mockData: AppScreens = {
  screens: [
    {
      id: "screen1",
      image: "homepage.png",
      annotations: [
        {
          id: "btn_signout",
          label: "Sign Out",
          coordinates: { x: 100, y: 200, width: 150, height: 50 },
          leadsTo: "screen2",
          isCorrectPath: true,
        },
        {
          id: "btn_settings",
          label: "Settings",
          coordinates: { x: 300, y: 200, width: 150, height: 50 },
          leadsTo: "screen3",
          isCorrectPath: false,
        },
      ],
    },
    {
      id: "screen2",
      image: "dashboard.png",
      annotations: [
        {
          id: "btn_profile",
          label: "Profile",
          coordinates: { x: 200, y: 250, width: 150, height: 50 },
          leadsTo: "screen4",
          isCorrectPath: true,
        },
        {
          id: "btn_logout",
          label: "Log Out",
          coordinates: { x: 400, y: 250, width: 150, height: 50 },
          leadsTo: "screen1",
          isCorrectPath: false,
        },
      ],
    },
    {
      id: "screen3",
      image: "settings.png",
      annotations: [
        {
          id: "btn_save",
          label: "Save Settings",
          coordinates: { x: 150, y: 300, width: 150, height: 50 },
          leadsTo: "screen2",
          isCorrectPath: false,
        },
        {
          id: "btn_cancel",
          label: "Cancel",
          coordinates: { x: 350, y: 300, width: 150, height: 50 },
          leadsTo: "screen1",
          isCorrectPath: true,
        },
      ],
    },
  ],
};


const mockData2: NodeData = {
  images: [
    {
      id: '5',
      filename: "Home_Screen",
      isStartPage: true,
      regions: [
        {
          name: "PlusButton",
          coordinates: { x: 21, y: 50, width: 42, height: 42 },
          leadsTo: '6',
          isCorrectPath: true,
          isTheEnd: false
        },
        {
          name: "profileIcon",
          coordinates: { x: 337, y: 47, width: 45, height: 45 },
          leadsTo: '9',
          isCorrectPath: false,
          isTheEnd: false
        },
        {
          name: "userbutton",
          coordinates: { x: 37, y: 104, width: 107, height: 50 },
          leadsTo: '11',
          isCorrectPath: false,
          isTheEnd: false
        },
        {
          name: "everyone",
          coordinates: { x: 22, y: 255, width: 346, height: 72 },
          leadsTo: '10',
          isCorrectPath: false,
          isTheEnd: false
        }
      ]
    },
    {
      id: '6',
      filename: "Home_Screen_plus_icon",
      isStartPage: false,
      regions: [
        {
          name: "AddTalkgroup",
          coordinates: { x: 15, y: 653, width: 371, height: 64 },
          leadsTo: '7',
          isCorrectPath: true,
          isTheEnd: false
        }
      ]
    },
    {
      id: '7',
      filename: "Add_talkgroup_page",
      isStartPage: false,
      regions: [
        {
          name: "addtalkgroupButton",
          coordinates: { x: 211, y: 154, width: 171, height: 50 },
          leadsTo: '8',
          isCorrectPath: true,
          isTheEnd: false
        }
      ]
    },
    {
      id: '8',
      filename: "Add_talkgroup_page_2",
      isStartPage: false,
      regions: [
        {
          name: "SaveTalkgroups",
          coordinates: { x: 32, y: 710, width: 336, height: 62 },
          leadsTo: '0',
          isCorrectPath: true,
          isTheEnd: true
        }
      ]
    },
    {
      id: '9',
      filename: "click_profile_button",
      isStartPage: false,
      regions: [
        {
          name: "closeInprofile",
          coordinates: { x: 336, y: 43, width: 51, height: 53 },
          leadsTo: '5',
          isCorrectPath: true,
          isTheEnd: false
        }
      ]
    },
    {
      id: '10',
      filename: "click_All_everyone",
      isStartPage: false,
      regions: [
        {
          name: "gobackfromeveryone",
          coordinates: { x: 17, y: 11, width: 367, height: 456 },
          leadsTo: '5',
          isCorrectPath: true,
          isTheEnd: false
        }
      ]
    },
    {
      id: '11',
      filename: "click_Users",
      isStartPage: false,
      regions: [
        {
          name: "gobacktohomescreenfromuser",
          coordinates: { x: 22, y: 10, width: 364, height: 548 },
          leadsTo: '5',
          isCorrectPath: true,
          isTheEnd: false
        },
        {
          name: "add talkgroup",
          coordinates: { x: 17, y: 655, width: 364, height: 60 },
          leadsTo: '7',
          isCorrectPath: true,
          isTheEnd: false
        },
        {
          name: "adduser",
          coordinates: { x: 18, y: 578, width: 365, height: 68 },
          leadsTo: '12',
          isCorrectPath: false,
          isTheEnd: false
        }
      ]
    },
    {
      id: '12',
      filename: "click_add_user",
      isStartPage: false,
      regions: [
        {
          name: "gobackfromuser",
          coordinates: { x: 17, y: 44, width: 61, height: 50 },
          leadsTo: '11',
          isCorrectPath: true,
          isTheEnd: false
        }
      ]
    }
  ]
}

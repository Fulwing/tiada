import { AppScreens } from "@/types/node/node";

export default function getMockData() {
    return mockData;
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
  
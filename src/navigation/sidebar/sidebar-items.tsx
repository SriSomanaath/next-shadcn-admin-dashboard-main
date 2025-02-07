import { File, Inbox, Send, Receipt, KeySquare, LucideIcon, PanelsTopLeft, Activity, ScanSearch } from "lucide-react";

export interface NavSubItem {
  title: string;
  path: string;
}

export interface NavMainItem {
  title: string;
  path: string;
  icon?: LucideIcon;
  isActive?: boolean;
  subItems?: NavSubItem[];
}

export interface NavGroup {
  id: number;
  label: string;
  items: NavMainItem[];
}

const basePath = "/dashboard";

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        path: basePath,
        icon: PanelsTopLeft,
        isActive: true,
      },
    ],
  },
  {
    id: 2,
    label: "Apps & Pages",
    items: [
      {
        title: "Chat",
        path: `${basePath}/inbox`,
        icon: Inbox,
      },
      {
        title: "Lead Management",
        path: "#",
        icon: Receipt,
        subItems: [
          { title: "Manage Users", path: `${basePath}/manage-users` },
          { title: "Manage Sheets", path: `${basePath}/manage-sheets` },
          // { title: "Add", path: `${basePath}/invoice/add` },
          // { title: "Edit", path: `${basePath}/invoice/edit` },
        ],
      },
      {
        title: "UTM Analysis",
        path: "#",
        icon: Activity,
        subItems: [
          { title: "Utm tracker", path: `${basePath}/utm-tracker` },
          { title: "Source tracker", path: `${basePath}/utm-sources` },
          // { title: "Add", path: `${basePath}/invoice/add` },
          // { title: "Edit", path: `${basePath}/invoice/edit` },
        ],
      },
      {
        title: "Messages",
        path: "#",
        icon: ScanSearch,
        subItems: [
          { title: "Webinar notifications", path: `${basePath}/webinar-notifications` },
          { title: "Sms notifications", path: `${basePath}/invoice/view` },
          // { title: "Add", path: `${basePath}/invoice/add` },
          // { title: "Edit", path: `${basePath}/invoice/edit` },
        ],
      },
      // {
      //   title: "Auth",
      //   path: "#",
      //   icon: KeySquare,
      //   subItems: [{ title: "Unauthorized", path: `${basePath}/auth/unauthorized` }],
      // },
      {
        title: "Drafts",
        path: `${basePath}/drafts`,
        icon: File,
      },
      {
        title: "Sent",
        path: `${basePath}/sent`,
        icon: Send,
      },
    ],
  },
  // {
  //   id: 3,
  //   label: "Billing",
  //   items: [
  //     {
  //       title: "Billing",
  //       path: `${basePath}/billing`,
  //       icon: Receipt,
  //     },
  //   ],
  // },
];

import axios from "axios";
import { getAccessToken } from "@/lib/auth";

const baseURL = "https://dvtoolstaging.bigvision.ai/dvtools_be/lead_assignment";

type SheetName = string;
type UserData = any;

export const getSheetNames = async (): Promise<SheetName[] | null> => {
  try {
    const token = await getAccessToken();

    const response = await axios.get(`${baseURL}/get_sheet_names`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    console.log("Raw response data for getSheetNames:", response.data);

    if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    console.error("Unexpected response structure:", response.data);
    return null;
  } catch (error) {
    console.error("Error fetching sheet names:", error);
    return null;
  }
};

export const getUsersForSheet = async (sheetName: string): Promise<UserData | null> => {
  try {
    const token = await getAccessToken();

    const response = await axios.get<UserData>(
      `${baseURL}/sheet_management?sheet_name=${encodeURIComponent(sheetName)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching users for sheet ${sheetName}:`, error);
    return null;
  }
};


export const getUsersForSheetv2 = async (sheetName: string): Promise<UserData | null> => {
  try {
    const token = await getAccessToken();

    const response = await axios.get<UserData>(
      `${baseURL}/sheet_management_v2?sheet_name=${encodeURIComponent(sheetName)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    console.log("theSheetName_v2", response);
    return response;
  } catch (error) {
    console.error(`Error fetching users for sheet ${sheetName}:`, error);
    return null;
  }
};

// type SheetHierarchy = Record<string, Record<string, Set<string>>>;

// type RoleMailSheet = {
//   role: string;
//   mails: string[];
//   sheetName: string;
// };

// function transformAllUsers(allUsers: SheetHierarchy): RoleMailSheet[] {
//   const result: RoleMailSheet[] = [];

//   for (const [sheetName, roles] of Object.entries(allUsers)) {
//     const roleMap: Record<string, Set<string>> = {};

//     for (const [role, emails] of Object.entries(roles)) {
//       if (!roleMap[role]) {
//         roleMap[role] = new Set();
//       }
//       emails.forEach(email => roleMap[role].add(email));
//     }

//     for (const [role, emails] of Object.entries(roleMap)) {
//       result.push({ role, mails: Array.from(emails), sheetName });
//     }
//   }

//   return result;
// }

// export const getAllUsersForSheets = async (): Promise<RoleMailSheet[] | null> => {
//   try {
//     const sheetNames = await getSheetNames();

//     if (!Array.isArray(sheetNames)) {
//       console.error("getAllUsersForSheets: Expected an array, got:", sheetNames);
//       return null;
//     }

//     const allUsers: Record<SheetName, Record<string, Set<string>>> = {};

//     await Promise.all(
//       sheetNames.map(async (sheetName) => {
//         const users = await getUsersForSheet(sheetName);

//         if (!users) {
//           console.warn(`No users found for sheet: ${sheetName}`);
//           return;
//         }

//         // console.log(`Raw users data for sheet "${sheetName}":`, users);

//         // const userData = users.data ?? users;
//         const userData = users.data;

//         const transformedUsers: Record<string, Set<string>> = {};

//         Object.entries(userData as Record<string, Record<string, { ACTIVE_STATUS: boolean }>>).forEach(([role, userEntries]: [string, Record<string, { ACTIVE_STATUS: boolean }>]) => {
//           // console.log(`Processing role: ${role}, entries:`, userEntries);

//           if (typeof userEntries !== "object" || !userEntries) {
//             // console.warn(`Unexpected structure for role "${role}" in sheet "${sheetName}"`);
//             return;
//           }

//           const activeUsers = Object.keys(userEntries).filter(
//             (email) => userEntries[email]?.ACTIVE_STATUS === true
//           );

//           if (activeUsers.length) {
//             transformedUsers[role] = new Set(activeUsers);
//           }
//         });

//         // console.log(`Transformed users for sheet "${sheetName}":`, transformedUsers);

//         if (Object.keys(transformedUsers).length > 0) {
//           allUsers[sheetName] = transformedUsers;
//         } else {
//           console.warn(`No active users found for sheet "${sheetName}"`);
//         }
//       })
//     );

//     console.log("Final allUsers object:", allUsers);
//     return transformAllUsers(allUsers);
//   } catch (error) {
//     console.error("Error fetching all users for sheets:", error);
//     return null;
//   }
// };

// export const getAllUsersForSheets = async (): Promise<Record<SheetName, Record<string, Set<string>>> | null> => {
//   try {
//     const sheetNames = await getSheetNames();

//     if (!Array.isArray(sheetNames)) {
//       // console.error("getAllUsersForSheets: Expected an array, got:", sheetNames);
//       return null;
//     }

//     const allUsers: Record<SheetName, Record<string, Set<string>>> = {};

//     await Promise.all(
//       sheetNames.map(async (sheetName) => {
//         const users = await getUsersForSheet(sheetName);
//         console.log("theSheetName____", users);
//         if (!users) {
//           // console.warn(`No users found for sheet: ${sheetName}`);
//           return;
//         }

//         // console.log(`Raw users data for sheet "${sheetName}":`, users);

//         // const userData = users.data ?? users;
//         const userData = users.data;

//         const transformedUsers: Record<string, Set<string>> = {};

//         Object.entries(userData as Record<string, Record<string, { ACTIVE_STATUS: boolean }>>).forEach(([role, userEntries]: [string, Record<string, { ACTIVE_STATUS: boolean }>]) => {
//           // console.log(`Processing role: ${role}, entries:`, userEntries);

//           if (typeof userEntries !== "object" || !userEntries) {
//             // console.warn(`Unexpected structure for role "${role}" in sheet "${sheetName}"`);
//             return;
//           }

//           const activeUsers = Object.keys(userEntries).filter(
//             (email) => userEntries[email]?.ACTIVE_STATUS === true
//           );

//           if (activeUsers.length) {
//             transformedUsers[role] = new Set(activeUsers);
//           }
//         });

//         // console.log(`Transformed users for sheet "${sheetName}":`, transformedUsers);

//         if (Object.keys(transformedUsers).length > 0) {
//           allUsers[sheetName] = transformedUsers;
//         } else {
//           console.warn(`No active users found for sheet "${sheetName}"`);
//         }
//       })
//     );

//     console.log("Final allUsers object:", allUsers);
//     return allUsers;
//   } catch (error) {
//     console.error("Error fetching all users for sheets:", error);
//     return null;
//   }
// };
export const getAllUsersForSheets_v2 = async (): Promise<Record<SheetName, Record<string, Set<string>>> | null> => {
  try {
    console.log("Fetching user data from getUsersForSheetv2...");
    const response = await getUsersForSheetv2("Student Certified");

    console.log("Raw response received:", response);

    if (!response || typeof response !== "object") {
      console.warn("getAllUsersForSheets: Unexpected response structure from getUsersForSheetv2");
      return null;
    }

    const usersData = response.data; // Extract only the relevant data
    console.log("Extracted usersData:", usersData);

    const allUsers: Record<SheetName, Record<string, Set<string>>> = {};

    console.log("Iterating over sheets...");
    Object.entries(usersData).forEach(([sheetName, sheetData]) => {
      console.log(`Processing sheet: ${sheetName}`);

      if (!sheetData || typeof sheetData !== "object" || !("data" in sheetData)) {
        console.warn(`Skipping invalid data structure for sheet: ${sheetName}`, sheetData);
        return;
      }

      const transformedUsers: Record<string, Set<string>> = {};

      console.log(`Iterating over roles in sheet: ${sheetName}...`);
      Object.entries(sheetData.data as Record<string, Record<string, { ACTIVE_STATUS: boolean }>>).forEach(
        ([role, userEntries]) => {
          console.log(`Processing role: ${role} in sheet: ${sheetName}`);

          if (typeof userEntries !== "object" || !userEntries) {
            console.warn(`Unexpected structure for role "${role}" in sheet "${sheetName}"`, userEntries);
            return;
          }

          // Extract active users
          const activeUsers = Object.keys(userEntries).filter(
            (email) => userEntries[email]?.ACTIVE_STATUS === true
          );

          console.log(`Active users found for role "${role}" in sheet "${sheetName}":`, activeUsers);

          if (activeUsers.length > 0) {
            transformedUsers[role] = new Set(activeUsers);
          }
        }
      );

      if (Object.keys(transformedUsers).length > 0) {
        console.log(`Adding transformed data for sheet "${sheetName}"`, transformedUsers);
        allUsers[sheetName as SheetName] = transformedUsers;
      } else {
        console.warn(`No active users found for sheet "${sheetName}"`);
      }
    });

    console.log("Final allUsers object:", JSON.stringify(allUsers, null, 2));
    return allUsers;
  } catch (error) {
    console.error("Error fetching all users for sheets:", error);
    return null;
  }
};

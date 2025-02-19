export interface LeadUser {
    FirstName: string;
    ID: string;
    LastName: string;
    Role: string;
    MaxTimeInHours: number;
    MinTimeInHours: number;
    SlackEmail: string;
  }

  export type LeadData = Record<string, Record<string, LeadUser>>;
  
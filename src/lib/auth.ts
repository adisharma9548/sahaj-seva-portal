export type UserRole = "CITIZEN" | "OFFICER" | "HEAD" | "CDO";

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  phone?: string;
  email?: string;
  officeId?: string;
  officeName?: string;
}

export const DEMO_ACCOUNTS = {
  citizen: {
    phone: "9999999999",
    otp: "123456",
    user: {
      id: "demo-citizen-id",
      name: "Ramesh Sharma",
      role: "CITIZEN" as UserRole,
      phone: "9999999999",
      email: "ramesh.sharma@demo.in",
    },
  },
  officer: {
    email: "officer@seva.demo",
    password: "off123",
    user: {
      id: "demo-officer-id",
      name: "Anand Verma (Desk 3)",
      role: "OFFICER" as UserRole,
      email: "officer@seva.demo",
      officeId: "OFF-TEH-SADAR",
      officeName: "Tehsil Ghaziabad (Sadar)",
    },
  },
  head: {
    email: "head@seva.demo",
    password: "head123",
    user: {
      id: "demo-head-id",
      name: "SDM Sadar Ghaziabad",
      role: "HEAD" as UserRole,
      email: "head@seva.demo",
      officeId: "OFF-TEH-SADAR",
      officeName: "Tehsil Ghaziabad (Sadar)",
    },
  },
  cdo: {
    email: "cdo@seva.demo",
    password: "cdo123",
    user: {
      id: "demo-cdo-id",
      name: "Chief Development Officer (CDO)",
      role: "CDO" as UserRole,
      email: "cdo@seva.demo",
    },
  },
};

export function canAccessOfficerPortal(role: UserRole): boolean {
  return role === "OFFICER" || role === "HEAD" || role === "CDO";
}

export function canAccessAdminDashboard(role: UserRole): boolean {
  return role === "HEAD" || role === "CDO";
}

export function canAccessCDOPanel(role: UserRole): boolean {
  return role === "CDO";
}

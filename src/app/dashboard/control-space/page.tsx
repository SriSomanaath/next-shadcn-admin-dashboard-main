"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock } from "lucide-react";

const roles = ["SUPER_ADMIN", "ADMIN", "OPERATIONS", "SALES_MANAGER", "MARKETING"];

const pages = [
  "Dashboard",
  "Lead Management",
  "Analysis",
  "Operations",
  "Audit",
  "Register",
  "Sales Calls",
];

const initialPermissions: Record<string, Record<string, boolean>> = {
  SUPER_ADMIN: { Dashboard: true, "Lead Management": true, Analysis: true, Operations: true, Audit: true, Register: true, "Sales Calls": true },
  ADMIN: { Dashboard: true, "Lead Management": true, Analysis: true, Operations: true, Audit: true, "Sales Calls": true },
  OPERATIONS: { Dashboard: true, Analysis: true, Operations: true, Audit: true },
  SALES_MANAGER: { Dashboard: true, "Lead Management": true, Analysis: true, Operations: true, Audit: true },
  MARKETING: { Dashboard: true, "Lead Management": true, Analysis: true, Operations: true, Audit: true },
};

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState(initialPermissions);

  const togglePermission = (role: string, page: string) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: { ...prev[role], [page]: !prev[role][page] },
    }));
  };

  return (
    <div className="container mx-auto p-6">
        <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center z-40">
            <Lock className="h-12 w-12 text-gray-500" />
            <p className="text-md font-semibold text-gray-500 mt-4">
            This feature is coming soon! Only can super admin access
            </p>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Manage Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[500px] w-full overflow-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border p-2">Role</th>
                  {pages.map((page) => (
                    <th key={page} className="border p-2">{page}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role}>
                    <td className="border p-2 font-semibold">{role}</td>
                    {pages.map((page) => (
                      <td key={page} className="border p-2 text-center">
                        <Checkbox
                          checked={permissions[role]?.[page] || false}
                          onCheckedChange={() => togglePermission(role, page)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
          <Button className="mt-4 w-full">Save Permissions</Button>
        </CardContent>
      </Card>
    </div>
  );
}

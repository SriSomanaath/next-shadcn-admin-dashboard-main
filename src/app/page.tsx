import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { options } from "./api/auth/[...nextauth]/options";

export default async function DashboardPage() {
  // Get the server session using our NextAuth OPTIONS.
  const session = await getServerSession(options);

  // If no session exists, redirect to the login page.
  if (!session) {
    redirect("/auth/login");
  }

  // If a session exists, render the dashboard.
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>
      <p>
        Welcome, {session.user?.name || session.user?.email || "User"}!
      </p>
    </div>
  );
}

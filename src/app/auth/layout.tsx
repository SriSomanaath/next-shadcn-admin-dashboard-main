import Image from "next/image";
import React, { ReactNode } from "react";

interface LayoutProps {
  readonly children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-sm font-medium"><Image src={"/logo.png"} alt={"opencv"} height={120} width={120}/></div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-md">
                &ldquo;The OpenCV Kundali Dashboard—our exclusive CRM for OpenCV University.&rdquo; <br />
                <span className="text-gray-500">Streamline engagement, automate workflows, and harness real-time analytics</span>
              </p>
              <footer className="text-[0.8rem] text-green-300">OpenCV University Internal CRM [Kundali]</footer>
            </blockquote>
          </div>
        </div>
        <div className="flex h-full lg:p-8">{children}</div>
      </div>
    </main>
  );
}

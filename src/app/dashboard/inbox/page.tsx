"use client";

import { useState } from "react";
import {
  Inbox,
  Send,
  Archive,
  Trash,
  Folder,
  MessageSquare,
  User,
  MoreVertical,
  Search,
  Star,
  Clock,
  Flag,
  MailWarning,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";

export default function MailDashboard() {
  const mails = [
    {
      id: 1,
      sender: "William Smith",
      subject: "Meeting Tomorrow",
      time: "9:00 AM",
      preview: "Let's have a meeting to discuss the project...",
      content:
        "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share...",
      labels: ["work", "important"],
    },
    {
      id: 2,
      sender: "Alice Smith",
      subject: "Re: Project Update",
      time: "8:30 AM",
      preview: "Thank you for the project update...",
      content: "The progress is impressive. The team has done a fantastic job...",
      labels: ["work", "important"],
    },
    {
      id: 3,
      sender: "Bob Johnson",
      subject: "Weekend Plans",
      time: "8:00 AM",
      preview: "Any plans for the weekend?",
      content: "I was thinking of going hiking in the nearby mountains...",
      labels: ["personal"],
    },
  ];

  const [selectedMail, setSelectedMail] = useState(mails[0]);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
      {/* Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center z-40">
        <Lock className="h-12 w-12 text-gray-600" />
        <p className="text-md font-semibold text-gray-700 mt-4">
          This feature is coming soon!
        </p>
      </div>

      {/* Main Content */}
      <div className="flex border-t pointer-events-none">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 border-r">
          <div className="flex items-center mb-6">
            <User className="mr-2" />
            <span className="font-semibold">Srinath G</span>
          </div>
          <nav className="space-y-2">
            {["Inbox", "Drafts", "Sent", "Junk", "Trash", "Archive"].map((item) => (
              <Button key={item} variant="ghost" className="w-full flex justify-start">
                <Inbox className="mr-2 h-5 w-5" /> {item}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Inbox</h2>
            <div className="flex items-center space-x-2">
              <Input placeholder="Search..." className="w-72" />
              <Button variant="outline">
                <Search />
              </Button>
            </div>
          </header>

          {/* Mail List */}
          <div className="flex flex-1 overflow-hidden">
            <section className="w-1/3 border-r">
              {mails.map((mail) => (
                <Card
                  key={mail.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 rounded-none ${
                    selectedMail.id === mail.id ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setSelectedMail(mail)}
                >
                  <CardContent>
                    <h3 className="font-semibold flex justify-between">
                      {mail.sender} <span className="text-xs text-gray-400">{mail.time}</span>
                    </h3>
                    <p className="text-sm text-gray-500">{mail.subject}</p>
                    <div className="flex space-x-2 mt-2">
                      {mail.labels.map((label) => (
                        <span key={label} className="text-xs px-2 py-1 bg-gray-300 rounded-full">
                          {label}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>

            {/* Mail Content */}
            <section className="flex-1 p-6">
              {selectedMail ? (
                <div>
                  <header className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{selectedMail.subject}</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Star />
                      </Button>
                      <Button variant="outline">
                        <Archive />
                      </Button>
                      <Button variant="outline">
                        <Trash />
                      </Button>
                      <Button variant="outline">
                        <Clock />
                      </Button>
                      <Button variant="outline">
                        <MailWarning />
                      </Button>
                      <Button variant="outline">
                        <MoreVertical />
                      </Button>
                    </div>
                  </header>
                  <p className="mt-4 text-gray-600">{selectedMail.content}</p>
                  <textarea placeholder={`Reply ${selectedMail.sender}...`} className="mt-4 w-full border p-2" />
                  <div className="flex justify-between mt-2">
                    <Toggle>
                      <Send className="mr-2 h-5 w-5" /> Send
                    </Toggle>
                    <Switch />
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500">Select an email to view</p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

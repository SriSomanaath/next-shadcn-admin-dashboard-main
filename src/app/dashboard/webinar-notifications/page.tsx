"use client";

import { useState } from "react";
import { Mail, Trash, Archive, ShoppingBag, Tag, Inbox, Search, Users, Bell, FileText, Star, MoreHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const emails = [
  {
    id: 1,
    sender: "Bob Johnson",
    subject: "Weekend Plans",
    preview: "Any plans for the weekend? I was thinking of going hiking...",
    tags: ["personal"],
    time: "almost 2 years ago",
  },
  {
    id: 2,
    sender: "Emily Davis",
    subject: "Re: Question about Budget",
    preview: "I have a question about the budget for the upcoming project...",
    tags: ["work", "budget"],
    time: "almost 2 years ago",
  },
  {
    id: 3,
    sender: "Michael Wilson",
    subject: "Important Announcement",
    preview: "I have an important announcement to make during our team meeting...",
    tags: ["meeting", "work", "important"],
    time: "almost 2 years ago",
  },
  {
    id: 4,
    sender: "Sarah Brown",
    subject: "Re: Feedback on Proposal",
    preview: "Thank you for your feedback on the proposal. I've made some updates...",
    tags: ["work", "important"],
    time: "over 1 year ago",
  },
];

export default function InboxPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen border-t">
      {/* Sidebar */}
      <aside className="w-64 text-color p-4 flex flex-col space-y-2 border-r border-gray-200">
        <div className="text-lg font-semibold">Alicia Koch</div>
        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start">
            <Inbox className="mr-2 h-5 w-5" /> Inbox <span className="ml-auto text-xs">128</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-5 w-5" /> Drafts <span className="ml-auto text-xs">9</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Mail className="mr-2 h-5 w-5" /> Sent
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Trash className="mr-2 h-5 w-5" /> Junk <span className="ml-auto text-xs">23</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Archive className="mr-2 h-5 w-5" /> Archive
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="mr-2 h-5 w-5" /> Social <span className="ml-auto text-xs">972</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Bell className="mr-2 h-5 w-5" /> Updates <span className="ml-auto text-xs">342</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Tag className="mr-2 h-5 w-5" /> Promotions <span className="ml-auto text-xs">21</span>
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white text-black p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Inbox</h1>
          <div className="flex space-x-2">
            <Button variant="outline">All mail</Button>
            <Button variant="outline">Unread</Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 flex items-center space-x-2">
          <Search className="text-black" />
          <Input
            className="bg-white border border-gray-700 text-white w-full"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Email List */}
        <div className="mt-6 space-y-4">
          {emails
            .filter((email) => email.sender.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((email) => (
              <div key={email.id} className="p-4 bg-white rounded-md">
                <div className="flex justify-between">
                  <div className="font-semibold">{email.sender}</div>
                  <div className="text-xs text-black">{email.time}</div>
                </div>
                <div className="text-sm font-medium">{email.subject}</div>
                <div className="text-xs text-black truncate">{email.preview}</div>
                <div className="mt-2 flex space-x-2">
                  {email.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-2 py-1 text-xs rounded-md bg-gray-700 text-gray-300"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}

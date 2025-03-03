"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lock } from "lucide-react";

interface DesignRequest {
  id: number;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
}

export default function DesignEngineering() {
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [newRequest, setNewRequest] = useState({ title: "", description: "" });

  const addRequest = () => {
    if (newRequest.title && newRequest.description) {
      setRequests([
        ...requests,
        { id: requests.length + 1, title: newRequest.title, description: newRequest.description, status: "Pending" },
      ]);
      setNewRequest({ title: "", description: "" });
    }
  };

  return (
    <div className="p-6 space-y-6">
        <div className="absolute inset-0 backdrop-blur-sm bg-white/60 flex flex-col items-center justify-center z-40">
        <Lock className="h-12 w-12 text-gray-500" />
        <p className="text-md font-medium text-gray-500 mt-4">
          This feature is coming soon!
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Design Engineering Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.title}</TableCell>
                  <TableCell>{req.description}</TableCell>
                  <TableCell>
                    <Badge variant={
                      req.status === "Pending" ? "secondary" : req.status === "In Progress" ? "outline" : "default"
                    }>
                      {req.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Request</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Design Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={newRequest.title}
              onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
            />
            <Textarea
              placeholder="Description"
              value={newRequest.description}
              onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
            />
            <Button onClick={addRequest}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

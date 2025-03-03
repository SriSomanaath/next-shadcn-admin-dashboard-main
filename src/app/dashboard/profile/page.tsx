"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

const Page = () => {
    const [user, setUser] = useState({
        name: "Srinath G",
        email: "srinath@example.com",
        phone: "+91 98765 43210",
        role: "Software Engineer",
        avatar: "https://avatars.githubusercontent.com/u/1?v=4",
    });

    const [formData, setFormData] = useState(user);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setUser(formData);
    };

    return (
        <div className="p-6 max-w-screen-3xl mx-auto">
            <Card className="shadow-lg">
                <div className="relative w-full h-48 bg-cover bg-center rounded-t-lg" 
                    style={{ 
                        backgroundImage: "url('https://media.licdn.com/dms/image/v2/D563DAQEVDV37SPdlrA/image-scale_191_1128/image-scale_191_1128/0/1687328036221/opencv_university_cover?e=1741330800&v=beta&t=vmsNsp381_Uy5mnj6BvJhqe0PHI7uaVnKLNY-U7T6kI')"
                    }}>
                    <div className="absolute inset-0 bg-black bg-opacity-5 backdrop-blur-sm rounded-t-lg"></div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" className="absolute top-3 right-3 bg-white/30 hover:bg-white/50">
                                <Pencil className="w-4 h-4 text-white" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Profile</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div>
                                    <Label>Name</Label>
                                    <Input name="name" value={formData.name} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label>Phone</Label>
                                    <Input name="phone" value={formData.phone} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label>Role</Label>
                                    <Input name="role" value={formData.role} onChange={handleInputChange} />
                                </div>
                            </div>
                            <CardFooter className="flex justify-end">
                                <Button onClick={handleSave}>Save</Button>
                            </CardFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="absolute bottom-4 left-6 flex items-center gap-4">
                        <Avatar className="w-20 h-20 border-4 border-white">
                            <AvatarImage src={""} alt="User Avatar" />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
                            <p className="text-lg text-gray-300">{user.role}</p>
                        </div>
                    </div>
                </div>

                <CardContent className="grid gap-4 p-6">
                    <div>
                        <Label>Email</Label>
                        <p className="text-gray-700">{user.email}</p>
                    </div>
                    <div>
                        <Label>Phone</Label>
                        <p className="text-gray-700">{user.phone}</p>
                    </div>
                    <div>
                        <Label>Role</Label>
                        <p className="text-gray-700">{user.role}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Page;
import { Loader2, User, Mail, Phone, MapPin, Briefcase, Tag, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface LeadDetailsSidebarProps {
    data?: Record<string, any>;
    isLoading: boolean;
}

const LeadDetails: React.FC<LeadDetailsSidebarProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
            </div>
        );
    }

    if (!data || Object.keys(data).length === 0) {
        return <div className="p-4 text-center text-gray-500">No lead details available.</div>;
    }

    return (
        <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto h-screen border-r">
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" /> Lead Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell className="font-medium">Name</TableCell><TableCell>{data["First Name"]} {data["Last Name"]}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Email</TableCell><TableCell className="text-blue-600">{data["Email"]}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Phone</TableCell><TableCell>{data["Contact Number"] || "N/A"}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">City</TableCell><TableCell>{data["City"] || "N/A"}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Country</TableCell><TableCell>{data["Country"] || "N/A"}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-purple-500" /> Lead Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell className="font-medium">Lead Stage</TableCell><TableCell>{data["Lead Stage"] || "N/A"}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Lead Sources</TableCell><TableCell>{data["Lead Sources"] || "N/A"}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Lead Tags</TableCell><TableCell>{data["Lead Tags"] || "N/A"}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Created Date</TableCell><TableCell>{data["Created Date Time"] || "N/A"}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-green-500" /> Professional Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell className="font-medium">Profession</TableCell><TableCell>{data["Profession"] || "N/A"}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Company</TableCell><TableCell>{data["Company"] || "N/A"}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Courses Interested</TableCell><TableCell>{data["Course Interested"] || "N/A"}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-yellow-500" /> Activity & Notes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell className="font-medium">Webinar Attended (min)</TableCell><TableCell>{data["Webinar Attended Time in min"] || "N/A"}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Live Webinar Dates</TableCell><TableCell>{data["Live Webinar Attd Dates"] || "N/A"}</TableCell></TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Notes</TableCell>
                                <TableCell>
                                    <div className="prose prose-sm rounded-lg bg-gray-100 text-gray-600 p-2" 
                                        dangerouslySetInnerHTML={{ __html: data["Notes"] || "<span class='text-gray-400'>N/A</span>" }} 
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-teal-500" /> Owner Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell className="font-medium">Owner Name</TableCell><TableCell>{data["Owner Name"] || "N/A"}</TableCell></TableRow>
                            <TableRow><TableCell className="font-medium">Owner Email</TableCell><TableCell className="text-blue-600">{data["Owner Email"] || "N/A"}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default LeadDetails;

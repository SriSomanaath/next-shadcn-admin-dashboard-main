import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Download, Loader2, Play } from "lucide-react";
import Link from "next/link";
import { PhoneCall, Mic, MessageSquare, CheckCircle } from "lucide-react";

const getActivityIcon = (activityType: string) => {
    switch (activityType) {
        case "Auto Q&A":
            return <MessageSquare className="w-3 h-3 text-blue-500" />;
        case "Transcription Done":
            return <CheckCircle className="w-3 h-3 text-green-500" />;
        case "Inbound Call":
            return <PhoneCall className="w-3 h-3 text-purple-500" />;
        case "Outbound Call":
            return <PhoneCall className="w-3 h-3 text-red-500" />;
        default:
            return <Mic className="w-3 h-3 text-gray-500" />; // Default icon
    }
};

interface Activity {
    datetime_utc: string;
    activity_type: string;
    massages: string;
    metadata?: {
        CALL_ID?: string;
        LS_Agent_Name?: string;
        Agent_Name?: string;
        Caller_Number?: string;
        Call_Type?: string;
        Call_Duration?: string;
        S3_Rec_URL?: string;
        Transcription_URL?: string;
        [key: string]: any;
    };
}

interface ActivityHistoryTabProps {
    data?: Activity[];
    isLoading: boolean;
}

const ActivityHistoryTab: React.FC<ActivityHistoryTabProps> = ({ data, isLoading }) => {
    // console.log("Activity History Data:", data);
    const activities = Array.isArray(data) ? data : [];

    if (isLoading) {
        return (
            <TabsContent value="activity">
                <div className="p-4 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="activity">
            <div className="p-4">
                {activities.length > 0 ? (
                    // Grid layout with up to 4 columns and gap
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {activities.map((activity, index) => (
                            <Accordion key={index} type="single" collapsible className="bg-white rounded-lg">
                                <AccordionItem value={`item-${index}`}>
                                    <AccordionTrigger className="p-2 text-left text-sm font-medium border rounded-lg">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                {getActivityIcon(activity.activity_type)}
                                                <div className="font-medium text-sm">{activity.activity_type}</div>
                                            </div>
                                            <div className="text-xs text-gray-500">{activity.datetime_utc}</div>
                                        </div>
                                    </AccordionTrigger>

                                    <AccordionContent className="p-2 text-xs border rounded-t-none rounded-lg">
                                        <p className="mb-2 text-[0.8rem] text-gray-700">{activity.massages}</p>
                                        {activity.metadata && (
                                            <div className="rounded text-[0.8rem] text-gray-500 space-y-4">
                                                {activity.metadata.CALL_ID && (
                                                    <p>
                                                        Call ID: {activity.metadata.CALL_ID}
                                                    </p>
                                                )}
                                                {(activity.metadata.LS_Agent_Name || activity.metadata.Agent_Name) && (
                                                    <p>
                                                        Agent: {activity.metadata.LS_Agent_Name || activity.metadata.Agent_Name}
                                                    </p>
                                                )}
                                                {activity.metadata.Caller_Number && (
                                                    <p>
                                                        Caller: {activity.metadata.Caller_Number}
                                                    </p>
                                                )}
                                                {activity.metadata.Call_Type && (
                                                    <p>
                                                        Call Type: {activity.metadata.Call_Type}
                                                    </p>
                                                )}
                                                {activity.metadata.Call_Duration && (
                                                    <p>
                                                        Duration: {activity.metadata.Call_Duration}
                                                    </p>
                                                )}
                                                <div>
                                                {activity.metadata.S3_Rec_URL && (
                                                    <div className="my-2 space-y-2">
                                                        <Accordion type="single" collapsible>
                                                            <AccordionItem value="audio">
                                                                <AccordionTrigger className="w-full flex items-center gap-2 bg-[#c3c7cc] text-white px-4 py-2 rounded-md font-semibold">
                                                                    <Play className="w-4 h-4 mr-4" />
                                                                    Listen to Call Recording
                                                                </AccordionTrigger>
                                                                <AccordionContent>
                                                                    <audio controls className="w-full mt-2 rounded">
                                                                        <source src={activity.metadata.S3_Rec_URL} type="audio/mpeg" />
                                                                        Your browser does not support the audio element.
                                                                    </audio>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        </Accordion>

                                                        <Button
                                                            variant="outline"
                                                            className="w-full flex items-center gap-2 !bg-accent text-black"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            <a href={activity.metadata.S3_Rec_URL} download className="w-full text-center">
                                                                Download Call Recording
                                                            </a>
                                                        </Button>
                                                    </div>
                                                )}
                                                {activity.metadata.Transcription_URL && (
                                                    <Button variant={"outline"} className="w-full flex items-center gap-2 ">
                                                        <Download className="w-4 h-4" />
                                                        <Link
                                                            href={activity.metadata.Transcription_URL}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="!hover:text-black w-full text-center"
                                                        >
                                                            Download Transcription
                                                        </Link>

                                                    </Button>
                                                )}                                                    
                                            </div>
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))}
                    </div>
                ) : (
                    <p>No activity found.</p>
                )}
            </div>
        </TabsContent>
    );
};

export default ActivityHistoryTab;

import { TabsContent } from "@/components/ui/tabs";
import { Loader2, FileText } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import AudioRecorder from "./AudioRecorder";

interface CallDetailsTabProps {
    data?: any[];
    isLoading: boolean;
}

const CallDetails: React.FC<CallDetailsTabProps> = ({ data, isLoading }) => {
    // console.log("Call Details Data:", data);
    const activities = Array.isArray(data) ? data : [];
    const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
    const [transcriptText, setTranscriptText] = useState<string>("");
    const [selectedAudio, setSelectedAudio] = useState<string | null>(null);

    // Fetch transcription text when a transcript is selected
    const fetchTranscription = useCallback(async (url: string) => {
        try {
            const response = await fetch(url);
            const text = await response.text();
            setTranscriptText(text);
        } catch (error) {
            console.error("Error fetching transcription:", error);
            setTranscriptText("Failed to load transcript.");
        }
    }, []);

    useEffect(() => {
        if (selectedTranscript) {
            fetchTranscription(selectedTranscript);
        }
    }, [selectedTranscript, fetchTranscription]);

    if (isLoading) {
        return (
            <TabsContent value="call-details">
                <div className="p-4 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="call-details">
            <div className="grid grid-cols-4 gap-4">
                {activities.map((call, index) => (
                    <Card key={index} className="flex flex-col border-none items-center !shadow-none">
                        <CardContent className="!p-0 w-full">
                            <AudioRecorder src={call.S3_Rec_URL} className="w-full mb-2" transcriptionURL={call.Transcription_URL}/>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
    );
};

export default CallDetails;

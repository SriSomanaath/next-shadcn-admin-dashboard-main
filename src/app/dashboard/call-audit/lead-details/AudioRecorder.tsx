import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, ChevronRight, Speech, AudioLines, Captions, PanelRightClose, ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AudioRecorderProps {
    src: string;
    transcriptionURL: string;
    className?: string;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ src, transcriptionURL, className }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState("0:00");
    const [highlightEnabled, setHighlightEnabled] = useState(true);
    const waveformRef = useRef<HTMLDivElement | null>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const transcriptRef = useRef<HTMLDivElement | null>(null);
    const transcriptLineRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [audioList, setAudioList] = useState([src]); 
    const [transcriptCues, setTranscriptCues] = useState<{ start: number; end: number; text: string }[]>([]);

    const handleNext = () => {
        if (currentIndex < audioList.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setShowSidebar(true);
        }
    };
    
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setShowSidebar(true);
        }
    };
    

    const fetchTranscription = useCallback(async () => {
        try {
            const response = await fetch(transcriptionURL);
            const text = await response.text();
            const cues = parseVTT(text);
            setTranscriptCues(cues);
        } catch (error) {
            console.error("Error fetching transcription:", error);
            setTranscriptCues([]);
        }
    }, [transcriptionURL]);

    useEffect(() => {
        if (showSidebar) {
            fetchTranscription();
        }
    }, [showSidebar, fetchTranscription]);

    useEffect(() => {
        if (waveformRef.current) {
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: "#ccc",
                progressColor: "#138dff",
                cursorColor: "#4F46E5",
                barWidth: 3,
                height: 80,
            });
            wavesurferRef.current.load(src);
            wavesurferRef.current.on("ready", () => {
                setDuration(formatTime(wavesurferRef.current?.getDuration() || 0));
            });
            wavesurferRef.current.on("audioprocess", () => {
                setCurrentTime(wavesurferRef.current?.getCurrentTime() || 0);
            });
        }
        return () => wavesurferRef.current?.destroy();
    }, [src]);

    useEffect(() => {
        const activeCueIndex = transcriptCues.findIndex(
            (cue) => currentTime >= cue.start && currentTime <= cue.end
        );

        if (activeCueIndex !== -1 && transcriptLineRefs.current[activeCueIndex]) {
            transcriptLineRefs.current[activeCueIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [currentTime, transcriptCues]);

    const togglePlay = () => {
        if (!wavesurferRef.current) return;
        setIsPlaying((prev) => {
            if (!prev) {
                setShowSidebar(true); // Open sidebar when playing
                wavesurferRef.current?.play();
            } else {
                wavesurferRef.current?.pause();
            }
            return !prev;
        });
    };

    const toggleHighlight = () => {
        setHighlightEnabled(!highlightEnabled);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    const parseVTT = (text: string) => {
        const cues: { start: number; end: number; text: string }[] = [];
        const lines = text.split("\n");
        let startTime = 0, endTime = 0, cueText = "";

        lines.forEach((line) => {
            if (line.includes("-->")) {
                const [start, end] = line.split(" --> ").map((time) => {
                    const [minutes, seconds] = time.split(":");
                    const [secs, millis] = (seconds || "0").split(".");
                    return (parseInt(minutes) * 60 + parseInt(secs) + (parseInt(millis) || 0) / 1000);
                });
                startTime = start;
                endTime = end;
            } else if (line.trim() === "") {
                if (cueText) {
                    cues.push({ start: startTime, end: endTime, text: cueText.trim() });
                    cueText = "";
                }
            } else {
                cueText += line + " ";
            }
        });
        return cues;
    };

    return (
        <>
            <Card className={`relative flex flex-col items-center w-64 h-64 transition-transform duration-100 ${isPlaying ? "scale-105" : ""} ${className}`}>
                <button onClick={() => setShowSidebar(true)} className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full">
                    <ChevronRight className="h-5 w-5" />
                </button>
                <CardContent className="w-full flex flex-col items-center pt-12">
                    <div ref={waveformRef} className="w-full" />
                    <div className="flex justify-between w-full text-xs mt-2">
                        <span>{formatTime(currentTime)}</span>
                        <span>{duration}</span>
                    </div>
                    <button onClick={togglePlay} className="p-2 bg-primary rounded-full text-[#1e1e1e] mt-4">
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                </CardContent>
            </Card>

            {showSidebar && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
                        onClick={() => setShowSidebar(false)}
                    ></div>

                    <div className="fixed top-0 right-0 w-[30rem] h-full bg-white shadow-lg border-l p-4 z-50 transition-transform duration-300 ease-in-out transform translate-x-0">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center justify-between">
                                <button onClick={handlePrev} disabled={currentIndex === 0} className="px-2 py-2 text-gray-800 disabled:opacity-50 mr-2">
                                    <ChevronLeft size={20} />
                                </button>
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Captions />
                                </h2>
                                <button onClick={handleNext} disabled={currentIndex === audioList.length - 1} className="px-2 py-2 text-gray-800 disabled:opacity-50 ml-2">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleHighlight}
                                    className={`px-2 py-2 rounded-full transition-all duration-300 ease-in-out hover:scale-110 ${highlightEnabled ? "bg-black text-white" : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    <AudioLines size={20} />
                                </button>
                                <button onClick={togglePlay} className="p-2 bg-primary rounded-full text-[#1e1e1e] flex items-center justify-center">
                                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                </button>
                                {/* Close Sidebar Button */}
                                <button
                                    onClick={() => setShowSidebar(false)}
                                    className="px-3 py-2 text-[#686e75] hover:text-black transition-all duration-300 ease-in-out"
                                >
                                    <PanelRightClose />
                                </button>
                            </div>
                        </div>
                        <ScrollArea className="h-full p-2 border rounded-md" ref={transcriptRef}>
                            {transcriptCues.map((cue, idx) => {
                                const match = cue.text.match(/^\[(SPEAKER_\d+)\]:/);
                                const speaker = match ? match[1] : null;
                                const textWithoutSpeaker = speaker && match ? cue.text.replace(match[0], "").trim() : cue.text;
                                return (
                                    <div
                                        key={idx}
                                        ref={(el) => { transcriptLineRefs.current[idx] = el; }}
                                        className={`transcript-line mb-2 p-2 rounded flex items-start transition-colors duration-300 ${highlightEnabled && currentTime >= cue.start && currentTime <= cue.end
                                                ? "bg-yellow-200"
                                                : "hover:bg-gray-100"
                                            }`}
                                    >
                                        <div className="flex-shrink-0">
                                            <Speech
                                                className="mr-2"
                                                color={speaker === "SPEAKER_00" ? "#1c3a58" : speaker === "SPEAKER_01" ? "#2d64a1" : "gray"}
                                            />
                                        </div>

                                        <span className="ml-2 text-gray-700 flex-1 break-words">
                                            {textWithoutSpeaker}
                                        </span>
                                    </div>
                                );
                            })}
                        </ScrollArea>
                    </div>
                </>
            )}
        </>
    );
};

export default AudioRecorder;

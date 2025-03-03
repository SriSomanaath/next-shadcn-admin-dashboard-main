import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Pencil, CheckCircle, XCircle, Zap, FileText, Loader2 } from "lucide-react";
import { TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Command, CommandDialog, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
import {ChevronRight } from 'lucide-react';
interface QAData {
    [key: string]: {
        answer: boolean | string;
        is_red?: boolean;
    };
}

interface AuditTabProps {
    qaData: QAData;
    handleEditClick: () => void;
    setIsSearchOpen: (open: boolean) => void;
    isSearchOpen:any;
    isLoading: boolean;
}

const AuditTab = ({ qaData, handleEditClick, setIsSearchOpen, isSearchOpen, isLoading }: AuditTabProps) => {
    const [search, setSearch] = useState('');

    if (isLoading) {
        return (
            <TabsContent value="lead-details">
                <div className="p-4 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
                </div>
            </TabsContent>
        );
    }


    if (!qaData) {
        return (
            <TabsContent value="lead-details">
                <div className="p-4 text-center text-gray-500">No lead details available.</div>
            </TabsContent>
        );
    }

    return (
        <>
        <TabsContent value="audit">
            <Card className="border-none shadow-none mt-2">
                <CardContent className="p-0 border-none">
                    {/* Search Button */}
                    <div className="flex justify-end mb-2">
                        <Button variant="outline" size="icon" onClick={() => setIsSearchOpen(true)}>
                            <Search className="w-5 h-5" />
                        </Button>
                        <span className="ml-2 text-gray-500 my-auto">Ctrl + K</span>
                    </div>

                    {/* Scrollable QA Section */}
                    <ScrollArea className="h-[calc(100vh-12.5rem)] overflow-y-auto p-2 !border-t">
                        <div className="columns-2 md:columns-4 gap-4 space-y-4 pr-2">
                            {Object.entries(qaData).map(([question, { answer, is_red }]) => {
                                let AnswerIcon = FileText;
                                let answerColor = "text-gray-500";

                                if (typeof answer === "boolean") {
                                    if (answer) {
                                        AnswerIcon = CheckCircle;
                                        answerColor = is_red ? "text-green-700" : "text-green-500";
                                    } else {
                                        AnswerIcon = XCircle;
                                        answerColor = is_red ? "text-red-600" : "text-green-500";
                                    }
                                }

                                return (
                                    <div
                                        key={question}
                                        className={`relative break-inside-avoid p-2 shadow-md rounded-t-none border-l-2 
                                            ${is_red ? "border-red-500 bg-red-50" : "border-[#92cfda]"} 
                                            rounded-md w-full flex flex-col justify-between group`}
                                    >
                                        {/* Edit Button (Hidden by Default, Shows on Hover) */}
                                        <button
                                            onClick={handleEditClick}
                                            className="absolute top-0 -right-1 p-1 border rounded-full bg-gray-50 text-gray-500 hover:text-[#138dff]
                                            opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        >
                                            <Pencil className="w-3 h-3" />
                                        </button>

                                        {/* Question & Answer Section */}
                                        <div className="flex items-center gap-2">
                                            {is_red && <Zap className="w-4 h-4 text-red-500" />}
                                            <p className="font-medium text-gray-900">{question}</p>
                                        </div>
                                        <p className={`text-xs flex items-center gap-2 ${answerColor}`}>
                                            <AnswerIcon className="w-4 h-4" />
                                            {typeof answer === "boolean" ? (answer ? "Yes" : "No") : answer}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </TabsContent>
        <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="absolute shadow-lg border top-1/2 px-2.5 py-0 -right-4 bg-white transform -translate-y-1/2 rounded-full">
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] p-4">
                        <h2 className="text-lg font-semibold mb-4">Red Flags</h2>
                        <ScrollArea className="h-[400px] grid grid-cols-1 gap-4">
                            {Object.entries(qaData)
                                .filter(([_, { is_red }]) => is_red)
                                .map(([question, { answer }]) => (
                                    <div key={question} className="p-4 border border-red-500 bg-red-50 rounded-md shadow-sm">
                                        <p className="font-semibold text-gray-900">{question}</p>
                                        <p className="text-gray-700 text-sm">{typeof answer === 'boolean' ? (answer ? 'Yes' : 'No') : answer}</p>
                                    </div>
                                ))}
                        </ScrollArea>
                    </SheetContent>
                </Sheet>

                {/* Command Dialog (Search Modal) */}
                <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                    <Command>
                        <CommandInput 
                            placeholder="Search questions..." 
                            value={search} 
                            onValueChange={setSearch} 
                        />
                        <CommandList>
                            {Object.entries(qaData)
                                .filter(([question]) => question.toLowerCase().includes(search.toLowerCase()))
                                .map(([question, { answer }]) => (
                                    <CommandItem key={question} onSelect={() => setIsSearchOpen(false)}>
                                        <div>
                                            <p className="font-semibold text-gray-900">{question}</p>
                                            <p className="text-gray-700 text-sm">
                                                {typeof answer === 'boolean' ? (answer ? 'Yes' : 'No') : answer}
                                            </p>
                                        </div>
                                    </CommandItem>
                                ))}
                        </CommandList>
                    </Command>
                </CommandDialog>
        </>
    );
};

export default AuditTab;

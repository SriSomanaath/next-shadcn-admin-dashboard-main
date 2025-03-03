'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetleadqaMutation, useGetleadqaRecordActivitiesMutation } from '@/redux/services/leadqaServices';
import AuditTab from './AuditTab';
import ActivityHistoryTab from './ActivityHistoryTab';
import CallDetails from './CallDetails';
import { useSearchParams } from 'next/navigation';
import { Copy, FileSliders, Mail, Phone, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Page = () => {
    const [qaData, setQaData] = useState({});
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [getLeadqaActivity, { isLoading: isLoadingLeadqaActivity }] = useGetleadqaRecordActivitiesMutation();
    const [getLeadQA, { isLoading: isLoadingLeadQA }] = useGetleadqaMutation();
    const [leadActivites, setLeadActivities] = useState([]);
    const [leadCallDetails, setLeadCallDetails] = useState();
    const [leadDetails, setLeadDetails] = useState();
    const searchParams = useSearchParams();
    const leadId = searchParams.get('lead_id');
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    useEffect(() => {
        const handleGetData = async () => {
            try {
                const qaResponse = await getLeadQA(leadId).unwrap();
                const toDisplay = qaResponse?.data?.to_display;
                setQaData(qaResponse?.data[toDisplay]?.qa_data || {});
            } catch (error) {
                console.error('Error fetching Lead QA Data:', error);
            }
            
            try {
                const activitiesResponse = await getLeadqaActivity(leadId).unwrap();
                setLeadActivities(activitiesResponse?.activities);
                setLeadCallDetails(activitiesResponse?.call_details);
                setLeadDetails(activitiesResponse?.lead_details);
                console.log('activitiesResponse:', activitiesResponse?.lead_details);
            } catch (error) {
                console.error('Error fetching Lead Activities Data:', error);
            }
        };
        
        handleGetData();
    }, [getLeadQA, getLeadqaActivity]);

    return (
        <div className="relative flex text-xs border-t overflow-hidden">
            <div className='w-[25%] flex flex-col overflow-y-auto space-y-4 pr-4'>
                <Card>
                    <Card className="relative w-full max-w-sm bg-white text-[#1e1e1e] !shadow-none !rounded-none">
                    <div className="absolute top-4 right-4 flex gap-3">
                        <Link href={`https://in21.leadsquared.com/LeadManagement/LeadDetails?LeadID=${leadId}`}>
                            <Share2 className="w-5 h-5 cursor-pointer" />                        
                        </Link>
                        <Copy className="w-5 h-5 cursor-pointer" />
                    </div>

                    <CardContent className="!p-2 space-y-2">
                        <div>
                        <div className="text-lg font-normal text-gray-600">{leadDetails?.["First Name"]} {leadDetails?.["Last Name"]}</div>
                        <div className="italic text-xs">{leadDetails?.["Lead Stage"]}</div>
                        </div>

                        <div className="flex items-center gap-2 pt-12">
                        <Mail className="w-3 h-3" />
                        <span>{leadDetails?.["Email"]}</span>
                        <Copy className="w-3 h-3 text-blue-400 cursor-pointer" />
                        </div>

                        <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        <span>{leadDetails?.["Contact Number"]}</span>
                        <Copy className="w-3 h-3 text-green-400 cursor-pointer" />
                        </div>

                        <div className="">
                        Location: {leadDetails?.["City"]}, {leadDetails?.["Country"]}
                        </div>
                    </CardContent>
                    </Card>
                    <CardContent className="!p-2 space-y-2">
                        {leadDetails ? (
                            Object.entries(leadDetails).map(([key, value]) => (
                                <div key={key} className="flex justify-between border-b py-1">
                                    <span className="font-normal">{key}</span>
                                    <span className="text-gray-700">{value ? value.toString() : 'N/A'}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No lead details available.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="w-[75%] flex flex-col">
                <Tabs defaultValue="audit" className="w-full pt-6">
                    <TabsList className="flex justify-center w-fit ml-0">
                        <Link href="/dashboard/call-audit" passHref>
                            <FileSliders className='w-6 h-6 mr-2'/>
                        </Link>
                        <TabsTrigger value="audit">Audit</TabsTrigger>
                        <TabsTrigger value="activity">Activity History</TabsTrigger>
                        <TabsTrigger value="call-details">Call Details</TabsTrigger>
                    </TabsList>
                    <AuditTab qaData={qaData} handleEditClick={handleEditClick} setIsSearchOpen={setIsSearchOpen} isSearchOpen={isSearchOpen} isLoading={isLoadingLeadQA}/>
                    <ActivityHistoryTab data={leadActivites} isLoading={isLoadingLeadqaActivity}/>
                    <CallDetails data={leadCallDetails} isLoading={isLoadingLeadqaActivity}/>
                </Tabs>
            </div>
        </div>
    );
}

export default Page;

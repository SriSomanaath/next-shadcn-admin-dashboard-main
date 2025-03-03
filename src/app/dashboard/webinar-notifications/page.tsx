"use client";

import { useEffect, useState } from "react";
import {
  FolderX, FileClock, ChartColumnBig, CloudUpload, CalendarCheck, MessageCirclePlus, CalendarIcon, Video, MessageSquare, CheckCircle2, XCircle,
  CheckCircle, MessageCircle, Clock, Tag, Link, ListChecks,
  DollarSign,
  BadgeDollarSign,
  MonitorUp,
  BetweenHorizontalEnd,
  PackageMinus,
  CalendarFold,
  Gift,
  CalendarCheck2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useGetWebinarConfigQuery, usePostAddLeadsMutation, usePostDeleteLeadsMutation, usePostDisableSmsCountryCodeMutation, usePostEnableSmsCountryCodeMutation, usePostScheduleMsgMutation, usePostSmsSentStatsMutation, usePostSmsStatsFileMutation, usePostSmsWebinarStatsMutation } from "@/redux/services/MessagesServices";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import AccountSwitcher from "@/components/ui/account-switcher";
import { SelectValue, SelectContent, SelectTrigger, Select, SelectItem } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimelineDemo } from "@/components/ui/demo";
import { Timeline } from "@/components/ui/timeline2";

const accounts = [
  { label: "Webinar Config", email: "webinar@config.com", icon: <Video className="h-4 w-4 text-[#3759cf]" /> },
  { label: "SMS Config", email: "sms@config.com", icon: <MessageSquare className="h-4 w-4 text-[#2ea50e]" /> },
];

const cardData = [
  { id: "upload", title: "Upload SMS Stats", icon: <CloudUpload className="w-5 h-5" />, hasUpload: true },
  { id: "add", title: "Add SMS Leads", icon: <MessageCirclePlus className="w-5 h-5" />, hasUpload: true, hasDate: true, hasTimezone: true },
  { id: "delete", title: "Delete SMS Leads", icon: <FolderX className="w-5 h-5" />, hasSelect: true },
  { id: "webinar", title: "SMS Stats Webinar Time", icon: <FileClock className="w-5 h-5" />, hasSelect: true },
  { id: "stats", title: "SMS Sent Stats", icon: <ChartColumnBig className="w-5 h-5" />, hasSelect: true },
  { id: "calendar", title: "Delete SMS Leads", icon: <CalendarCheck className="w-5 h-5" />, hasSelect: true },
];

const Page = () => {
  const [selectedCard, setSelectedCard] = useState<string>("upload");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<"country" | "price">("country");
  const { data: webinarConfig, error: fetchWebinarConfigError, isFetching, refetch } = useGetWebinarConfigQuery("");
  const webinarconfigData = webinarConfig?.data;
  const [countryStatus, setCountryStatus] = useState<{ [key: string]: boolean }>({});
  const [postSmsStats, { isLoading: isSmsStatsLoading }] = usePostSmsStatsFileMutation();
  const [postAddLeads, { isLoading: isAddLeadsLoading }] = usePostAddLeadsMutation();
  const [postDeleteLeads, { isLoading: isDeleteLeadsLoading }] = usePostDeleteLeadsMutation();
  const [postSmsStatsWebinarTime, { isLoading: isSmsStatsWebinarTimeLoading }] = usePostSmsWebinarStatsMutation();
  const [postSmsSentStats, { isLoading: isSmsSentStatsLoading }] = usePostSmsSentStatsMutation();
  const [postScheduleMsg, { isLoading: isScheduleMsgLoading }] = usePostScheduleMsgMutation();
  const [postEnableSmsCountryCode] = usePostEnableSmsCountryCodeMutation();
  const [postDisableSmsCountryCode] = usePostDisableSmsCountryCodeMutation();
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastAction, setLastAction] = useState<{ countryCode: string; status: boolean } | null>(null);
  const selectedCardData = cardData.find(card => card.id === selectedCard);
  // console.log("webinarconfigData", webinarconfigData);

  const handleFormSubmit = async (postFunction: any, formData: any) => {
    try {
      const result = await postFunction({ data: formData }).unwrap();
      await refetch();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (webinarconfigData?.data_sms_cost_is_enable) {
      const initialStatus: { [key: string]: boolean } = {};
      Object.keys(webinarconfigData.data_sms_cost_is_enable).forEach((countryCode) => {
        initialStatus[countryCode] = webinarconfigData.data_sms_cost_is_enable[countryCode].SENDING_ENABLED;
      });
      setCountryStatus(initialStatus);
    }
  }, [webinarconfigData]);

  let dataArray = Object.keys(webinarconfigData?.data_sms_cost_is_enable || {}).map((countryCode) => ({
    code: countryCode,
    country: webinarconfigData?.data_sms_cost_is_enable[countryCode]?.COUNTRY_NAME ?? "Unknown",
    price: parseFloat(webinarconfigData?.data_sms_cost_is_enable[countryCode]?.PRICE_PER_SMS ?? "0.0000"),
    enabled: countryStatus[countryCode] ?? false
  }));

  if (search.trim()) {
    dataArray = dataArray.filter((item) => item.country.toLowerCase().includes(search.toLowerCase()));
  }

  const visibleData = dataArray.sort((a, b) => (sortColumn === "country" ? a.country.localeCompare(b.country) : a.price - b.price));

  const handleCardChange = (id: string) => {
    setSelectedCard(id);
  };

  const handleToggleSendingEnabled = async (countryCode: string, currentStatus: boolean) => {
    try {
      setLastAction({ countryCode, status: currentStatus });

      if (currentStatus) {
        await postDisableSmsCountryCode(countryCode).unwrap();
        setAlert({
          type: "success",
          message: `Country code ${countryCode} disabled successfully!`,
        });
      } else {
        await postEnableSmsCountryCode(countryCode).unwrap();
        setAlert({
          type: "success",
          message: `Country code ${countryCode} enabled successfully!`,
        });
      }

      setCountryStatus(prevStatus => ({
        ...prevStatus,
        [countryCode]: !currentStatus
      }));
      const timeout = setTimeout(() => setAlert(null), 3000);
      setUndoTimeout(timeout);
    } catch (error: any) {
      console.error(`Error ${currentStatus ? 'disabling' : 'enabling'} country code:`, error);

      const errorMessage = error?.data?.message ||
        error?.data?.error ||
        error?.status
        ? `Server responded with status ${error.status}`
        : "An unexpected error occurred.";

      setAlert({
        type: "error",
        message: `Failed to ${currentStatus ? 'disable' : 'enable'} country code: ${errorMessage}`,
      });

      const timeout = setTimeout(() => setAlert(null), 3000);
      setUndoTimeout(timeout);
    }
  };

  const handleUndo = async () => {
    if (undoTimeout) clearTimeout(undoTimeout); // Cancel auto-close

    if (lastAction) {
      try {
        if (lastAction.status) {
          await postEnableSmsCountryCode(lastAction.countryCode).unwrap();
        } else {
          await postDisableSmsCountryCode(lastAction.countryCode).unwrap();
        }

        setCountryStatus(prevStatus => ({
          ...prevStatus,
          [lastAction.countryCode]: lastAction.status
        }));

        setAlert({
          type: "success",
          message: `Undo successful: ${lastAction.status ? 'Enabled' : 'Disabled'} country code ${lastAction.countryCode}`,
        });

        setLastAction(null);
      } catch (error) {
        console.error("Error undoing last action:", error);
      }
    }
  };

  const timelineData = [
    { title: "Upload SMS Stats", content: <p>Upload CSV for SMS stats.</p>, cardData: { hasUpload: true }, icon : <MonitorUp className="w-5 h-5"/>, AddClass: "bg-[#edf4fe] text-[#066dcd]"  },
    { title: "Add SMS Leads", content: <p>Upload CSV and select time.</p>, cardData: { hasUpload: true, hasDate: true, hasTimezone: true }, icon:  <BetweenHorizontalEnd className="w-5 h-5" />, AddClass: "bg-[#edf4fe] text-[#066dcd]" },
    { title: "Delete SMS Leads", content: <p>Choose webinar date & timezone.</p>, cardData: { hasDropdown: true }, icon: <PackageMinus className="w-5 h-5" />, AddClass: "bg-[#edf4fe] text-[#066dcd]"  },
    { title: "SMS Stats Webinar Time", content: <p>Check SMS stats for webinar.</p>, cardData: { hasDropdown: true }, icon: <CalendarFold className="w-5 h-5" />, AddClass: "bg-[#edf4fe] text-[#066dcd]"  },
    { title: "SMS Sent Stats", content: <p>Review SMS send stats.</p>, cardData: { hasDropdown: true }, icon: <Gift className="w-5 h-5" />, AddClass: "bg-[#edf4fe] text-[#066dcd]"  },
    { title: "Schedule Messages", content: <p>Schedule messages for events.</p>, cardData: { hasDropdown: true, hasSelect: true }, icon: <CalendarCheck2 className="w-5 h-5" />, AddClass: "bg-[#edf4fe] text-[#066dcd]" },
  ];
  
  return (
    <div className="flex overflow-hidden border-t">
      <aside className="w-64 flex flex-col space-y-2 border-r pt-2 pr-2 overflow-hidden">
        <nav className="space-y-1">
          <AccountSwitcher isCollapsed={false} accounts={accounts} />
          {cardData.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start ${selectedCard === item.id ? "bg-gray-100" : ""}`}
              onClick={() => handleCardChange(item.id)}
            >
              {item.icon} <span className="text-[0.75rem] text-[#5a5959]">{item.title}</span>
            </Button>
          ))}
        </nav>
      </aside>

      <main className="w-[100%] p-3">
        <div className="flex w-full space-x-4">
          <div className="w-[65%] overflow-x-auto rounded-lg">
            {/* <AnimatePresence mode="wait">
              {selectedCardData && (
                <motion.div
                  key={JSON.stringify(selectedCardData)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  layout
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-center gap-2">
                        {selectedCardData.title}
                        {selectedCardData.icon}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedCardData.hasUpload && (
                        <div className="space-y-2">
                          <Label>Upload File</Label>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <CloudUpload className="w-5 h-5" />
                            <Input type="file" />
                          </div>
                        </div>
                      )}
                      {selectedCardData.hasDate && (
                        <div className="space-y-2">
                          <Label>Select Date & Time</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full flex justify-between">
                                {selectedDate ? selectedDate.toLocaleString() : "dd/mm/yyyy, --:-- --"}
                                <CalendarIcon className="ml-2 w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                      {selectedCardData.hasTimezone && (
                        <div className="space-y-2">
                          <Label>Timezone</Label>
                          <Input placeholder="Timezone, e.g. US/Pacific" />
                        </div>
                      )}
                      {selectedCardData.hasSelect && (
                        <>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Webinar Date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="date1">Webinar Date 1</SelectItem>
                              <SelectItem value="date2">Webinar Date 2</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="utc">UTC</SelectItem>
                              <SelectItem value="ist">IST</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      )}
                      <Button className="w-full">Submit</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence> */}
            <div className="h-[calc(100vh-6rem)]">
              <Timeline data={timelineData}/>
            </div>
          </div>
          <aside className="flex flex-col gap-4 w-[35%] h-[calc(100vh-6rem)]">
            <div className="flex items-center gap-3 justify-between">
              <Input
                placeholder="Search by country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-sm"
              />
              <Select value={sortColumn} onValueChange={(value) => setSortColumn(value as "country" | "price")}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full overflow-y-auto rounded-lg">
              <Table >
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="text-left">Country</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="w-full border">
                  {visibleData.map(({ code, country, price, enabled }) => (
                    <TableRow key={code} className="hover:bg-gray-50 !border-none">
                      <TableCell className="py-3">
                        <div className="font-medium">{country}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="inline-flex items-center gap-1">
                          <BadgeDollarSign size={14} className="text-gray-500"/>{price.toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full cursor-pointer ${enabled ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                            }`}
                          onClick={() => setCountryStatus({ ...countryStatus, [code]: !enabled })}
                        >
                          {enabled ? (
                            <>
                              <CheckCircle size={16} className="mr-1" /> Enabled
                            </>
                          ) : (
                            <>
                              <XCircle size={16} className="mr-1" /> Disabled
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="grid grid-cols-2 gap-2 ">
              <Card className="w-full bg-gray-50 shadow-sm relative p-1 bg-gradient-to-tr from-transparent to-green-100 shadow-sm">
                <CardContent className="p-1 text-[10px] text-gray-700">
                  <span className="absolute top-1 right-1 text-gray-500"><MessageCircle size={14} /></span>
                  <p className="font-semibold">First Message:</p>
                  <p>{webinarconfigData?.first_msg}</p>
                </CardContent>
              </Card>

              <Card className="w-full bg-gray-50 shadow-sm relative p-1 bg-gradient-to-tr from-transparent to-red-100 shadow-sm">
                <CardContent className="p-1 text-[10px] text-gray-700">
                  <span className="absolute top-1 right-1 text-gray-500"><MessageCircle size={14} /></span>
                  <p className="font-semibold">Second Message:</p>
                  <p>{webinarconfigData?.second_msg}</p>
                </CardContent>
              </Card>

              <Card className="w-full bg-gray-50 shadow-sm relative p-1 bg-gradient-to-tr from-transparent to-gray-100 shadow-sm">
                <CardContent className="p-1 text-[10px] text-gray-700">
                  <span className="absolute top-1 right-1 text-gray-500"><Clock size={14} /></span>
                  <p className="font-semibold">Msg Before Webinar Max:</p>
                  <p>{webinarconfigData?.first_msg_before_webinar_max}</p>
                </CardContent>
              </Card>

              <Card className="w-full bg-gray-50 shadow-sm relative p-1 bg-gradient-to-tr from-transparent to-blue-100 shadow-sm">
                <CardContent className="p-1 text-[10px] text-gray-700">
                  <span className="absolute top-1 right-1 text-gray-500"><Clock size={14} /></span>
                  <p className="font-semibold">Msg Before Webinar Min:</p>
                  <p>{webinarconfigData?.first_msg_before_webinar_min}</p>
                </CardContent>
              </Card>

              <Card className="w-full bg-gray-50 shadow-sm relative p-1 col-span-2 bg-gradient-to-tr from-transparent to-gray-100 shadow-sm">
                <CardContent className="p-1 text-[10px] text-gray-700">
                  <span className="absolute top-1 right-1 text-gray-500"><Tag size={14} /></span>
                  <p className="font-semibold">Sales Campaign Msg:</p>
                  <p>{webinarconfigData?.sales_campaign_msg.replace(/_/g, " ")}</p>
                  <p className="font-semibold">Webinar Link:</p>
                  <a href={webinarconfigData?.webinar_link} target="_blank" className="text-blue-500 underline flex items-center gap-1">
                    <Link size={12} /> {webinarconfigData?.webinar_link}
                  </a>
                </CardContent>
              </Card>
            </div>

          </aside>
        </div>
      </main>
      <div className="fixed bottom-5 right-5 z-50 w-80">
        {alert && (
          <Alert variant={alert.type === "error" ? "destructive" : "default"} className="relative">
            {alert.type === "success" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
            <div className="flex-1">
              <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </div>
            {lastAction && (
              <button
                className="ml-2 text-blue-500 underline hover:text-blue-700"
                onClick={handleUndo}
              >
                Undo
              </button>
            )}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
              <div className="h-full bg-blue-500 animate-progress"></div>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Page;
"use client";

import { useEffect, useRef, useState } from "react";
import {
  FolderX, FileClock, ChartColumnBig, CloudUpload, CalendarCheck, MessageCirclePlus, CalendarIcon, Send, Upload, Video, MessageSquare, MoreVertical,
  Info, CheckCircle2, XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import AccountSwitcher from "@/components/ui/account-switcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetWebinarConfigQuery, usePostDisableSmsCountryCodeMutation, usePostEnableSmsCountryCodeMutation } from "@/redux/services/MessagesServices";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SmsPricingItem = {
  code: string;
  country: string;
  price: number;
  enabled: boolean;
};

const smsPricing: SmsPricingItem[] = [
  { code: "VN", country: "Vietnam", price: 0.1552, enabled: false },
  { code: "CH", country: "Switzerland", price: 0.0725, enabled: true },
  { code: "US", country: "United States", price: 0.0079, enabled: true },
  { code: "IT", country: "Italy", price: 0.0927, enabled: true },
  { code: "VU", country: "Vanuatu", price: 0.1657, enabled: true },
  { code: "SC", country: "Seychelles", price: 0.0873, enabled: true },
];

const accounts = [
  { label: "Webinar Config", email: "webinar@config.com", icon: <Video className="h-4 w-4 text-[#3759cf]" /> },
  { label: "SMS Config", email: "sms@config.com", icon: <MessageSquare className="h-4 w-4 text-[#2ea50e]" /> },
];

const cardData = [
  { title: "Upload for SMS Stats", icon: <CloudUpload className="w-5 h-5" />, hasUpload: true },
  { title: "Add SMS Leads", icon: <MessageCirclePlus className="w-5 h-5" />, hasUpload: true, hasDate: true, hasTimezone: true },
  { title: "Delete Sms Leads", icon: <FolderX className="w-5 h-5" />, hasSelect: true },
  { title: "Sms Stats Webinar Time", icon: <FileClock className="w-5 h-5" />, hasSelect: true },
  { title: "Sms Sent Stats", icon: <ChartColumnBig className="w-5 h-5" />, hasSelect: true },
  { title: "Delete Sms Leads", icon: <CalendarCheck className="w-5 h-5" />, hasSelect: true },
];

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [search, setSearch] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<"country" | "price">("country");
  const [sortedData, setSortedData] = useState<SmsPricingItem[]>([...smsPricing]);
  const { data: webinarConfig, error: fetchWebinarConfigError, isFetching, refetch } = useGetWebinarConfigQuery("");
  const [disableSmsCountryCode] = usePostDisableSmsCountryCodeMutation();
  const [enableSmsCountryCode] = usePostEnableSmsCountryCodeMutation();
  const webinarconfigData = webinarConfig?.data;
  const [uniqueUploadedWebinars, setUniqueUploadedWebinars] = useState<{ [key: string]: any }>({});
  const [countryStatus, setCountryStatus] = useState<{ [key: string]: boolean }>({});
  const [open, setOpen] = useState(false);
  const [undoTimeout, setUndoTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastAction, setLastAction] = useState<{ countryCode: string; status: boolean } | null>(null);
  
  const getUniqueUploadedWebinars = (uploadedWebinars: any, sentSmsWebinars: any) => {
    return Object.keys(uploadedWebinars)
      .filter(uploadedDatetime => {
        return !Object.keys(sentSmsWebinars).includes(uploadedDatetime);
      })
      .reduce((acc, uniqueDatetime) => {
        acc[uniqueDatetime] = uploadedWebinars[uniqueDatetime];
        return acc;
      }, {} as any);
  };


  useEffect(() => {
    if (webinarconfigData) {
      const uniqueWebinars = getUniqueUploadedWebinars(webinarconfigData.uploaded_webinars, webinarconfigData.sent_sms_webinars);
      console.log("webinarconfigDatawebinarconfigData", webinarconfigData);
      setUniqueUploadedWebinars(uniqueWebinars);
      const initialStatus: { [key: string]: boolean } = {};
      Object.keys(webinarconfigData.data_sms_cost_is_enable).forEach((countryCode) => {
        initialStatus[countryCode] = webinarconfigData.data_sms_cost_is_enable[countryCode].SENDING_ENABLED;
      });
      setCountryStatus(initialStatus);
    }
  }, [webinarconfigData]);

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);


  const handleToggleSendingEnabled = async (countryCode: string, currentStatus: boolean) => {
    try {
      // Save last action for undo
      setLastAction({ countryCode, status: currentStatus });
  
      if (currentStatus) {
        await disableSmsCountryCode(countryCode).unwrap();
        setAlert({
          type: "success",
          message: `Country code ${countryCode} disabled successfully!`,
        });
      } else {
        await enableSmsCountryCode(countryCode).unwrap();
        setAlert({
          type: "success",
          message: `Country code ${countryCode} enabled successfully!`,
        });
      }
  
      setCountryStatus(prevStatus => ({
        ...prevStatus,
        [countryCode]: !currentStatus
      }));
  
      // Auto-hide alert after 3 seconds, store timeout reference
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
  
      // Auto-hide alert after 3 seconds
      const timeout = setTimeout(() => setAlert(null), 3000);
      setUndoTimeout(timeout);
    }
  };
  
  // Undo function
  const handleUndo = async () => {
    if (undoTimeout) clearTimeout(undoTimeout); // Cancel auto-close
  
    if (lastAction) {
      try {
        if (lastAction.status) {
          await enableSmsCountryCode(lastAction.countryCode).unwrap();
        } else {
          await disableSmsCountryCode(lastAction.countryCode).unwrap();
        }
  
        setCountryStatus(prevStatus => ({
          ...prevStatus,
          [lastAction.countryCode]: lastAction.status
        }));
  
        setAlert({
          type: "success",
          message: `Undo successful: ${lastAction.status ? 'Enabled' : 'Disabled'} country code ${lastAction.countryCode}`,
        });
  
        // Clear last action
        setLastAction(null);
      } catch (error) {
        console.error("Error undoing last action:", error);
      }
    }
  };
  
  useEffect(() => {
    if (!webinarconfigData?.data_sms_cost_is_enable) return;

    let dataArray = Object.keys(webinarconfigData.data_sms_cost_is_enable).map((countryCode) => ({
      code: countryCode,
      country: webinarconfigData.data_sms_cost_is_enable[countryCode]?.COUNTRY_NAME ?? "Unknown",
      price: parseFloat(webinarconfigData.data_sms_cost_is_enable[countryCode]?.PRICE_PER_SMS ?? "0.0000"),
      enabled: countryStatus[countryCode] ?? false
    }));

    // Apply search filter
    if (search.trim()) {
      dataArray = dataArray.filter((item) => item.country.toLowerCase().includes(search.toLowerCase()));
    }

    // Apply sorting
    dataArray.sort((a, b) => (sortColumn === "country" ? a.country.localeCompare(b.country) : a.price - b.price));

    setSortedData(dataArray);
  }, [webinarconfigData, search, sortColumn, countryStatus]);

  // Search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Sort handler
  const handleSortChange = (value: "country" | "price") => {
    setSortColumn(value);
  };

  // Filtered data based on search
  const filteredData = sortedData.filter(({ country }) =>
    country.toLowerCase().includes(search.toLowerCase())
  );

  const handleScrollToCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex h-[calc(100%)] border-t overflow-hidden text-md">
      <aside className="w-64 flex flex-col space-y-2 border-r pt-2 pr-2 overflow-hidden">
        <nav className="space-y-1">
          <AccountSwitcher isCollapsed={false} accounts={accounts} />
          {cardData.map((item, index) => (
            <Button key={index} variant="ghost" className="w-full justify-start" onClick={() => handleScrollToCard(index)}>
              {item.icon} <span className="text-[#5a5959]">{item.title}</span>
            </Button>
          ))}
        </nav>
      </aside>

      {/* Scrollable Card Section */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 h-[calc(100vh-5rem)]">
        {cardData.map((card, index) => (
          <Card key={index} ref={(el) => { cardRefs.current[index] = el; }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">{card.title} {card.icon}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {card.hasUpload && (
                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Upload className="w-5 h-5" />
                    <Input type="file" />
                  </div>
                </div>
              )}
              {card.hasDate && (
                <div className="space-y-2">
                  <Label>Select Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full flex justify-between">
                        {selectedDate ? format(selectedDate, "dd/MM/yyyy, HH:mm") : "dd/mm/yyyy, --:-- --"}
                        <CalendarIcon className="ml-2 w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              {card.hasTimezone && (
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input placeholder="Timezone, e.g. US/Pacific" />
                </div>
              )}
              {card.hasSelect && (
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
        ))}
      </main>
      <div className="w-96 border-l p-4 overflow-hidden">
        <div>
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search by country..."
              value={search}
              onChange={handleSearch}
              className="w-full mr-2"
            />
            <Select value={sortColumn} onValueChange={handleSortChange}>
              <SelectTrigger className="w-24 mr-2">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="p-2" onClick={() => setOpen(true)}>
                    <Info className="h-5 w-5" />
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Webinar Details</DialogTitle>
                  </DialogHeader>
                  <div className="text-sm space-y-2 p-2">
                    <p>
                      <strong>First Message:</strong> {webinarconfigData?.first_msg}
                    </p>
                    <p>
                      <strong>Second Message:</strong> {webinarconfigData?.second_msg}
                    </p>
                    <p>
                      <strong>Webinar Link:</strong>{" "}
                      <a href={webinarconfigData?.webinar_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {webinarconfigData?.webinar_link}
                      </a>
                    </p>
                    <p>
                      <strong>First Message Before Webinar Max:</strong> {webinarconfigData?.first_msg_before_webinar_max}
                    </p>
                    <p>
                      <strong>First Message Before Webinar Min:</strong> {webinarconfigData?.first_msg_before_webinar_min}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="max-h-[20rem] border rounded-lg overflow-y-auto mb-5">
            <Table className="mb-4 w-full">
              <TableHeader className="bg-gray-200 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-1/2">Country</TableHead>
                  <TableHead className="w-1/2">Enabled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map(({ code, country, price, enabled }) => (
                  <TableRow key={code} className="hover:bg-gray-100">
                    <TableCell className="w-1/2">
                      {country}
                      <br />${price.toFixed(4)}
                    </TableCell>
                    <TableCell className="w-1/2">
                      <Switch
                        checked={enabled}
                        onCheckedChange={() => handleToggleSendingEnabled(code, enabled)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
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

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300">
              <div className="h-full bg-blue-500 animate-progress"></div>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
}

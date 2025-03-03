"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { CalendarIcon, CloudUpload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Label } from "./label";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  cardData?: CardData;
  icon?: React.ReactNode;
  AddClass: string;
}

interface CardData {
  hasUpload?: boolean;
  hasDate?: boolean;
  hasTimezone?: boolean;
  hasSelect?: boolean;
  hasDropdown?: boolean;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });
  const calculatedHeight = Math.min(height, ref.current?.scrollHeight || height);
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-white dark:bg-neutral-950 md:px-2" ref={containerRef}>
      <div ref={ref} className="relative max-w-7xl mx-auto">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row pt-10 md:pt-16">
            <div className="sticky flex flex-col items-start top-20 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-1" />
              </div>
              <h5 className="text-sm ml-16 pt-2 font-normal text-gray-700 dark:text-neutral-500">
                 <span className={`flex gap-2 px-2 py-1 rounded-lg text-gray-300 ${item.AddClass}`}>{item.icon}{item.title}</span>
              </h5>
            </div>

            <div className="relative w-full pr-2">
              {item.cardData && (
                <Card className="">
                  <CardContent className="space-y-4 p-2">
                    {item.cardData.hasUpload && (
                      <div className="space-y-2">
                        <Label>Upload File</Label>
                        <div className="flex items-center gap-2 cursor-pointer">
                          <CloudUpload className="w-5 h-5" />
                          <Input type="file" />
                        </div>
                      </div>
                    )}
                    {item.cardData.hasDate && (
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
                          <Calendar 
                                mode="single" 
                                selected={selectedDate || undefined} 
                                onSelect={(day) => setSelectedDate(day ?? null)} 
                                />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    {item.cardData.hasTimezone && (
                      <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Input placeholder="US/Pacific" defaultValue="US/Pacific" />
                      </div>
                    )}
                    {item.cardData.hasDropdown && (
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
                            <SelectItem value="us_pacific">US/Pacific</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}
                    <Button className="w-full">Submit</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ))}

        <div style={{ height: (calculatedHeight + 50) + "px" }} className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]">
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

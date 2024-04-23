import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { DrawerTitle, DrawerDescription, DrawerHeader, DrawerFooter } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import useForm from "@/hooks/useForm"
import { Textarea } from "@/components/ui/textarea"
import { ChangeEvent, ChangeEventHandler, useCallback } from "react"
import { debounce, getLogoUrl } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { CURRENCY_CODES } from "@/lib/constants";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils";
import { ITEM } from '@/lib/types';

export default function Form({ data, closeDrawer }: {data?: ITEM, closeDrawer: () => void}) {
    const [formData, formActions] = useForm(data);
    console.log(formData);
    // id: number,
    // serviceName: string,
    // amount: number,
    // currency: string,
    // cycle: string,
    // billingDate: string,
    // notes?: string,
    // website: string,
    // logo?: string,

    const fetchLogo = useCallback(async (value: string) => {
        try {
            console.log('FETCHING LOGO....');
            const logo = await getLogoUrl(value);
            if (logo) {
                formActions.update('logo', logo);
            }
        } catch (e) {
            console.log(e);
        }
    }, [formActions])

    const debouncedFetchLogo = debounce(fetchLogo, 3000);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        console.log(e.target.id, e.target.value);
        if (e.target.id === 'website') {
            debouncedFetchLogo(e.target.value);
        }
        formActions.update(e.target.id, e.target.value);
    }, [debouncedFetchLogo, formActions]);

    const onSelectChange = useCallback((id: string, value: string) => {
        formActions.update(id, value);
    }, [formActions]);

    const onSave = useCallback(() => {
        formActions.save();
        closeDrawer();
    }, [formActions, closeDrawer]);

    return (
        <>
            <DrawerHeader>
                <DrawerTitle>Add Subscription</DrawerTitle>
                <DrawerDescription>Enter the details of your new subscription.</DrawerDescription>
            </DrawerHeader>
            <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label className="form-label-required" htmlFor="serviceName">
                        Name
                        </Label>
                        <Input value={formData.serviceName} onChange={onChange} id="serviceName" placeholder="Enter the Service" required />
                    </div>
                    <div>
                        <Label className="form-label-required" htmlFor="amount">
                        Amount
                        </Label>
                        <Input value={formData.amount}  onChange={onChange} id="amount" placeholder="Enter the amount" required />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                        <Label className="form-label-required" htmlFor="currency">
                        Currency
                        </Label>
                        <Select value={formData.currency}  onValueChange={(value) => onSelectChange('currency', value)} required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectGroup>
                                <SelectLabel>Currency</SelectLabel>
                                {CURRENCY_CODES.map((code, idx) => <SelectItem key={idx} value={code}>{code}</SelectItem>)}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="col-span-2">
                        <Label className="form-label-required" htmlFor="cycle">
                        Cycle
                        </Label>
                        <Select value={formData.cycle}  onValueChange={(value) => onSelectChange('cycle', value)} required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a cycle" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectGroup>
                                <SelectLabel>Cycle</SelectLabel>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col col-span-2">
                        <Label className="form-label-required mb-2" htmlFor="billingDate">
                        Billing Date
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal"
                                >
                                {formData.billingDate ? format(new Date(formData.billingDate), "dd-MM-yyyy") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                mode="single"
                                selected={formData.billingDate ? new Date(formData.billingDate) : undefined}
                                onSelect={(selectedDate) => {
                                    if (selectedDate) {
                                        onSelectChange('billingDate', format(selectedDate, "yyyy-MM-dd"));
                                    }
                                }}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="col-span-2">
                        <Label className="form-label-required" htmlFor="website">
                        Website
                        </Label>
                        <Input value={formData.website} onChange={onChange} id="website" placeholder="Enter the website" required />
                    </div>
                </div>
                <div className="">
                    <div>
                        <Label className="form-label-required" htmlFor="notes">
                        Notes
                        </Label>
                        <Textarea value={formData.notes} onChange={onChange} id="notes" placeholder="Enter the Notes" required />
                    </div>
                </div>
            </div>
            <DrawerFooter>
                <Button onClick={onSave} type="submit">Save</Button>
            </DrawerFooter>
        </>
    )
}
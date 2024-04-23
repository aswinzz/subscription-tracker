import { Button } from "@/components/ui/button"
import { ITEM } from "@/lib/types";
import { prettyDate } from "@/lib/utils";
import Image from "next/image";
import { DrawerTrigger, DrawerTitle, DrawerDescription, DrawerHeader, DrawerFooter, DrawerContent, Drawer } from "@/components/ui/drawer"
import React, { useState, useCallback, useMemo } from 'react';
import Form from "@/components/form";
import { Logo } from "@/components/ui/logo";
import { CURRENCY_SYMBOLS } from "@/lib/constants";

export default function Item({item, loadData}: {item: ITEM, loadData: () => void }) {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const closeDrawer = useCallback(() => {
      setDrawerOpen(false);
      loadData();
    }, [loadData]);

    const capitalizeFirstLetter = (text: string) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
    
    const nextPayment = useMemo(() => {
        const billingDateParts = item.billingDate.split("-");
        const billingDay = parseInt(billingDateParts[2], 10);
        const billingMonth = parseInt(billingDateParts[1], 10); // JS months are 0-indexed
        const billingYear = parseInt(billingDateParts[0], 10);

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // JS months are 0-indexed
        const currentDay = today.getDate();

        let nextPaymentYear = currentYear;
        let nextPaymentMonth = billingMonth;
        let isDue = false;

        if (item.cycle === "monthly") {
            if ((currentDay > billingDay)) {
                nextPaymentMonth = currentMonth;
                isDue = true;
            } else {
                nextPaymentMonth = currentMonth + 1; 
            }
            if (currentMonth === 12 && currentDay < billingDay) { // If it's December and the day has passed, move to next year
                nextPaymentYear++;
                nextPaymentMonth = 1; // January
            }
        } else if (item.cycle === "yearly") {
            if (currentMonth > billingMonth || (currentMonth === billingMonth && currentDay > billingDay)) {
                isDue = true;
            } else if (currentMonth < billingMonth) {
                // nextPaymentYear++;
            }
        }

        const nextPaymentDate = new Date(nextPaymentYear, nextPaymentMonth, billingDay);
        console.log(item.billingDate, nextPaymentDate);
        return { date: prettyDate(`${nextPaymentDate.getFullYear()}-${String(nextPaymentDate.getMonth()).padStart(2, '0')}-${String(nextPaymentDate.getDate()).padStart(2, '0')}`), isDue };
    }, [item.billingDate, item.cycle]);

    return (
        <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                    <div className="cursor-pointer rounded-lg border border-gray-300 p-4 justify-between flex items-center space-x-4">
                        {/* <Image
                            alt="Logo"
                            className="rounded-lg"
                            height="48"
                            src={item.logo || ''}
                            style={{
                                aspectRatio: "48/48",
                                objectFit: "cover",
                            }}
                            width="48"
                        /> */}
                        <div className="flex items-center space-x-4">
                            <Logo url={item.logo || ''} name={item.serviceName} />
                            <div className="grid gap-1.5">
                                <div className="font-semibold">{item.serviceName}</div>
                                <div className={`text-sm text-gray-500 dark:text-gray-400`}>Next payment: <span className={nextPayment.isDue ? "text-red-500" : ""}>{nextPayment.date}</span></div>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{CURRENCY_SYMBOLS[item.currency]} {item.amount} / {capitalizeFirstLetter(item.cycle.replace(/ly/g, ""))}</div>
                        </div>
                    </div>
            </DrawerTrigger>
            <DrawerContent>
                <Form data={item} closeDrawer={closeDrawer} />
            </DrawerContent>
        </Drawer>
    )
}
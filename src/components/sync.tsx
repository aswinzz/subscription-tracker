import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubscriptionContext } from "@/context/SessionContext";
import useAuth from "@/hooks/useAuth";
import { ITEM } from "@/lib/types";
import { dbActions } from "@/lib/utils";
import { createSupabaseClient } from "@/utils/supabase/server";
import { useCallback, useContext, useEffect, useState } from "react";

export function Sync({data}: { data: ITEM[] }) {
    const { loadData } = useContext(SubscriptionContext);
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [doNotShow, setDoNotShow] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const supabase = createSupabaseClient();
    const handleCheckboxChange = useCallback((index: number) => {
        setCheckedItems(prevItems => {
            const currentIndex = prevItems.indexOf(index);
            if (currentIndex === -1) {
                return [...prevItems, index];
            } else {
                return prevItems.filter(item => item !== index);
            }
        });
    }, []);

    const onSync = useCallback(async () => {
        for (const index of checkedItems) {
            const item = data[index];
            await dbActions('insert', item, supabase);
        }
        if (doNotShow)
            localStorage.setItem('doNotShowSyncDialog', doNotShow.toString())
        setCheckedItems([]);
        loadData();
    }, [checkedItems, data, doNotShow, loadData, supabase]);

    const onDoNotChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setDoNotShow(e.target.checked);
    }, []);

    const onToggle = useCallback((value: boolean) => {
        if (!value && doNotShow) {
            localStorage.setItem('doNotShowSyncDialog', doNotShow.toString());
        }
        setIsOpen(value);
    }, [doNotShow]);

    if (data?.length === 0 || localStorage.getItem('doNotShowSyncDialog') === 'true') {
        return <></>;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onToggle}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Sync your Data</DialogTitle>
                <DialogDescription>
                    There are some subscriptions saved in your browser, sync them to the cloud.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex flex-row flex-wrap" style={{ width: '100%', overflowX: 'auto' }}>
                    {data.map((item, index) => (
                        item.serviceName ? <div key={index} className="grid grid-cols-4 items-center gap-4 p-1 w-40">
                            <input
                                type="checkbox"
                                checked={checkedItems.includes(index)}
                                onChange={() => handleCheckboxChange(index)}
                            />
                            <div className="col-span-3">{item.serviceName}</div>
                        </div> : null
                    ))}
                </div>
            </div>
            <Button disabled={!checkedItems.length} onClick={onSync} type="submit">Sync Data</Button>
            <div>
                <input
                    type="checkbox"
                    id="doNotShowAgain"
                    onChange={onDoNotChange}
                />
                <label htmlFor="doNotShowAgain" className="ml-2 text-400">Do not show this dialog box again</label>
            </div>
            </DialogContent>
        </Dialog>
    )
}

"use client";

import { ChangeEvent, useCallback, useRef } from "react";
import Header from "@/components/header";
import Toolbar from "@/components/toolbar";
import Search from "@/components/search";
import Item from "@/components/item";
import { useMemo, useEffect, useState } from "react";
import { debounce, getData, unSyncedData } from "@/lib/utils";
import { ITEM } from "@/lib/types";
import Total from "@/components/total";
import { CURRENCY_SYMBOLS } from "@/lib/constants";
import { createSupabaseClient } from '@/utils/supabase/server'
import { Sync } from "@/components/sync";
import { SubscriptionProvider } from "@/context/SessionContext";

export default function Home() {
  const supabase = createSupabaseClient();
  const [subscriptions, setSubscriptions] = useState<ITEM[]>([]);
  const [unsyncedData, setUnsycnedData] = useState<ITEM[]>([]);
  const [search, setSearch] = useState<string | undefined>();

  const loadData = useCallback(async (search?: string | undefined) => {
    console.log("LOAD DATA", search);
    const user = await supabase.auth.getUser();
    let user_id;
    if (user?.data?.user?.id) {
      user_id = user?.data?.user?.id;
    }
    const data = getData();
    if (user_id) {
      const { data: subscriptions } = search ?
        await supabase.from('subscriptions').select().eq('user_id', user_id).ilike('serviceName', `%${search}%`) : 
        await supabase.from('subscriptions').select().eq('user_id', user_id);

      console.log('subscriptions', subscriptions);
      setSubscriptions(subscriptions || []);
      const toSync = unSyncedData(data, subscriptions as ITEM[]);
      console.log('toSync', toSync);
      setUnsycnedData(toSync);
    } else {
      const filteredData = search ? data.filter((item: ITEM) => item.serviceName.toLowerCase().includes(search.toLowerCase())) : data;
      setSubscriptions(filteredData || []);
    }
  }, []);

  const debouncedLoadData = useRef(debounce(loadData, 1000));

  const total = useMemo(() => {
    return subscriptions.reduce((acc, curr) => {
      const monthlyAmount = curr.cycle.toLowerCase() === "monthly" ? parseInt(String(curr.amount), 10) : parseInt(String(curr.amount), 10) / 12;
      return acc + monthlyAmount;
    }, 0);
  }, [subscriptions]);

  const currency = useMemo(() => {
    return subscriptions.length > 0 ? subscriptions[0].currency : "INR";
  }, [subscriptions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log("SEARCH", search);
    console.log(debouncedLoadData.current);
    debouncedLoadData.current(e.target.value);
  }, [search]);

  return (
    <SubscriptionProvider loadData={loadData}>
      <div className="px-4 py-2 flex flex-col w-full md:max-w-lg m-auto flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-4 space-y-4">
          <Total currency={CURRENCY_SYMBOLS[currency]} amount={total} />
          <Search value={search} onChange={onSearchChange} />
          <div className="grid gap-4">
            {subscriptions.map((item, idx) => <Item key={idx} item={item} />)}
          </div>
        </main>
        <Toolbar />
        <Sync data={unsyncedData} />
      </div>
    </SubscriptionProvider>
  );
}

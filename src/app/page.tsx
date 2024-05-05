"use client";

import { useCallback } from "react";
import Header from "@/components/header";
import Toolbar from "@/components/toolbar";
import Search from "@/components/search";
import Item from "@/components/item";
import { useMemo, useEffect, useState } from "react";
import { getData, unSyncedData } from "@/lib/utils";
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

  const loadData = useCallback(async () => {
    const user = await supabase.auth.getUser();
    let user_id;
    if (user?.data?.user?.id) {
      user_id = user?.data?.user?.id;
    }
    const data = getData();
    if (user_id) {
      const { data: subscriptions } = await supabase.from('subscriptions').select().eq('user_id', user_id);
      console.log('subscriptions', subscriptions);
      setSubscriptions(subscriptions || []);
      const toSync = unSyncedData(data, subscriptions as ITEM[]);
      console.log('toSync', toSync);
      setUnsycnedData(toSync);
    } else {
      setSubscriptions(data || []);
    }
  }, []);

  const total = useMemo(() => {
    return subscriptions.reduce((acc, curr) => acc + parseInt(String(curr.amount), 10), 0);
  }, [subscriptions]);

  const currency = useMemo(() => {
    return subscriptions.length > 0 ? subscriptions[0].currency : "INR";
  }, [subscriptions]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <SubscriptionProvider loadData={loadData}>
      <div className="px-4 py-2 flex flex-col w-full md:max-w-lg m-auto flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-4 space-y-4">
          <Total currency={CURRENCY_SYMBOLS[currency]} amount={total} />
          <Search />
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

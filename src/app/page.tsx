"use client";

import { useCallback } from "react";
import Header from "@/components/header";
import Toolbar from "@/components/toolbar";
import Search from "@/components/search";
import Item from "@/components/item";
import { useEffect, useState } from "react";
import { getData } from "@/lib/utils";
import { ITEM } from "@/lib/types";

export default function Home() {
  const [subscriptions, setSubscriptions] = useState<ITEM[]>([]);

  const loadData = useCallback(() => {
    const data = getData();
    setSubscriptions(data || []);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="px-4 py-2 flex flex-col w-full md:max-w-lg m-auto flex flex-col h-screen">
      <Header />
      <main className="flex-1 p-4 space-y-4">
        <Search />
        <div className="grid gap-4">
          {subscriptions.map((item, idx) => <Item loadData={loadData} key={idx} item={item} />)}
        </div>
      </main>
      <Toolbar loadData={loadData}/>
    </div>
  );
}

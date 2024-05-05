import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ITEM } from "./types";
import { SupabaseClient } from '@supabase/supabase-js';

const LS_KEY = "subscription-tracker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getData() {
  const data = localStorage.getItem(LS_KEY);
  if (data) {
    const subscriptionData = JSON.parse(data);
    return subscriptionData;
  }

  return [];
}

export async function dbActions(action: string, data: any, supabase: SupabaseClient) {
  try {
    const user = await supabase.auth.getUser();
    let user_id;
    if (user?.data?.user?.id) {
      user_id = user?.data?.user?.id;
    } else {
      return;
    }
    switch (action) {
      case 'insert':
        const subscription = {...data, user_id};
        delete subscription.id;
        console.log('subscription', subscription);
        await supabase.from("subscriptions").insert([subscription]);
        break;
      case 'upsert':
        const item = {...data, user_id};
        await supabase.from("subscriptions").update(item).eq("id", item.id);
        break;
      case 'delete':
        break;
      default:
        break;
    }
  } catch (error) {
    console.log("Error in Db Actions", error);
  }
  
};

export async function setData(item: ITEM, supabase: SupabaseClient) {
  const subscriptionData = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  const user = await supabase.auth.getUser();
  let user_id;
  if (user?.data?.user?.id) {
    user_id = user?.data?.user?.id;
  }
  if (item.website && !item.logo) {
    const logo = await getLogoUrl(item.website);
    item = {...item, logo };
  }
  if (item.id > 0) {
    const index = subscriptionData.findIndex((obj: ITEM) => obj.id === item.id);
    if (index !== -1) {
        subscriptionData[index] = { ...subscriptionData[index], ...item };
        await dbActions('upsert', {...subscriptionData[index], ...item}, supabase);
    }
  } else {
    let id = 1;
    if (subscriptionData.length) {
      id = subscriptionData[subscriptionData.length -1 ].id + 1
    }
    subscriptionData.push({ ...item, id });
    await dbActions('insert', item, supabase);
  }
  
  localStorage.setItem(LS_KEY, JSON.stringify(subscriptionData));
}

export function deleteItem(id: number, supabase: SupabaseClient) {
  const subscriptionData = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  if (subscriptionData.length) {
    subscriptionData.filter((obj: ITEM) => obj.id !== id);
    localStorage.setItem(LS_KEY, JSON.stringify(subscriptionData));
  }
}

export function prettyDate(date: string) {
  const dateObj = new Date(date);

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = String(dateObj.getFullYear());

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

export async function getLogoUrl(websiteUrl: string) {
  if (!websiteUrl.startsWith('https://')) {
    websiteUrl = 'https://' + websiteUrl;
  }
  const response = await fetch(`/api/fetch-logo?url=${websiteUrl}`);
  const data = await response.json();
  return data?.logoUrl;
};


export const debounce = <F extends (...args: any[]) => void>(func: F, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};

export const unSyncedData = (lsData: ITEM[], dbData: ITEM[]) => {
  const unSyncedItems = lsData.filter(lsItem => {
    return !dbData.some(dbItem => 
      dbItem.serviceName === lsItem.serviceName &&
      dbItem.currency === lsItem.currency &&
      dbItem.amount == lsItem.amount &&
      dbItem.cycle?.toLocaleLowerCase() === lsItem.cycle?.toLocaleLowerCase() &&
      dbItem.billingDate === lsItem.billingDate
    );
  });
  return unSyncedItems;
};
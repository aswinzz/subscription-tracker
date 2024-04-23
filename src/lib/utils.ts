import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ITEM } from "./types";

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

export function setData(item: ITEM) {
  const subscriptionData = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  if (item.id > 0) {
    const index = subscriptionData.findIndex((obj: ITEM) => obj.id === item.id);
    if (index !== -1) {
        subscriptionData[index] = { ...subscriptionData[index], ...item };
    }
  } else {
    let id = 1;
    if (subscriptionData.length) {
      id = subscriptionData[subscriptionData.length -1 ].id + 1
    }
    subscriptionData.push({ ...item, id });
  }
  
  localStorage.setItem(LS_KEY, JSON.stringify(subscriptionData));
}

export function deleteItem(id: number) {
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
  const response = await fetch(websiteUrl);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const faviconLink = doc.querySelector('link[rel="icon"]') as HTMLLinkElement;
  const appleTouchIconLink = doc.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
  const shortcutIconLink = doc.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement;

  const logoUrl = faviconLink?.href || appleTouchIconLink?.href || shortcutIconLink?.href;

  return logoUrl;
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
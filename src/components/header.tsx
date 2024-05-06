import Image from "next/image";
import { Auth } from "./auth";

export default function Header() {
    return (
        <header className="p-4 border-b">
            <div className="justify-between flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                    <Image alt="subscription-tracker" src="/budget.png" height="100" width="100" className="w-8 h-8" />
                    <h1 className="text-xl font-bold">Subscription Tracker</h1>
                </div>
                <Auth />
            </div>
        </header>
    )
}
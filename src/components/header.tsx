import { Button } from "@/components/ui/button"
import { ComingSoon } from "@/components/ui/comingsoon"
import Image from "next/image";

function HomeIcon(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    )
}

  
export default function Header() {
    return (
        <header className="p-4 border-b">
            <div className="justify-between flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                    <Image alt="subscription-tracker" src="/budget.png" height="100" width="100" className="w-8 h-8" />
                    <h1 className="text-2xl font-bold">Subscription Tracker</h1>
                </div>
                <ComingSoon>
                <Button>Sign In</Button>
                </ComingSoon>
            </div>
        </header>
    )
}
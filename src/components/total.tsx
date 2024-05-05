import { Input } from "@/components/ui/input"
import { ComingSoon } from "./ui/comingsoon";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";


export default function Total({ currency, amount }: { currency: string, amount: number }) {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
            <CardTitle>Total Amount</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-center gap-4">
            <div className="text-4xl font-bold">{currency} {amount} / Month</div>
            </CardContent>
        </Card>
    );
}
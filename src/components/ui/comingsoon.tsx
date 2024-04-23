import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function ComingSoon({children, className}: {children: React.ReactNode, className?: string}) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className={className}>{children}</TooltipTrigger>
                    <TooltipContent>
                        Coming Soon
                    </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
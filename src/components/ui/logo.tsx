import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
   
export function Logo({url, name}: {url: string, name: string}) {
    return (
        <Avatar>
        <AvatarImage src={url} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
    )
}
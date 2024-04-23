import { Input } from "@/components/ui/input"
import { ComingSoon } from "./ui/comingsoon";

function SearchIcon(props) {
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
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    )
  }


export default function Search() {
    return (
      <ComingSoon className="w-full">
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center w-full max-w-md">
              <SearchIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <Input disabled className="pl-8" placeholder="Search for a subscription" type="search" />
          </div>
        </div>
      </ComingSoon>

    );
}
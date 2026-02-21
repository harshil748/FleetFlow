import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ToolbarProps {
  searchPlaceholder?: string;
  actions?: React.ReactNode;
}

export default function Toolbar({ searchPlaceholder = "Search...", actions }: ToolbarProps) {
  return (
    <div className="flex items-center gap-3 mb-6 flex-wrap">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={searchPlaceholder} className="pl-9 glass border-border/40 focus:neon-border" />
      </div>
      {actions && <div className="flex gap-2 ml-auto">{actions}</div>}
    </div>
  );
}

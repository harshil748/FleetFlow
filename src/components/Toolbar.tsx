import { Search, SlidersHorizontal, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      <Button variant="outline" size="sm" className="glass border-border/40 text-muted-foreground hover:text-foreground">
        <SlidersHorizontal className="h-4 w-4 mr-1" /> Group By
      </Button>
      <Button variant="outline" size="sm" className="glass border-border/40 text-muted-foreground hover:text-foreground">
        <Filter className="h-4 w-4 mr-1" /> Filter
      </Button>
      <Button variant="outline" size="sm" className="glass border-border/40 text-muted-foreground hover:text-foreground">
        <ArrowUpDown className="h-4 w-4 mr-1" /> Sort
      </Button>
      {actions && <div className="flex gap-2 ml-auto">{actions}</div>}
    </div>
  );
}

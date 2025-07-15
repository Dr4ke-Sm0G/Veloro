import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  backLink?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, backLink, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-2">
        {backLink && (
          <Link href={backLink}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        )}
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
      {actions}
    </div>
  );
}

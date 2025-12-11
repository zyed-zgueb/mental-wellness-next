import { ArrowUp, ArrowDown, Minus, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  className,
  iconClassName,
}: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4" />;
      case "down":
        return <ArrowDown className="h-4 w-4" />;
      case "stable":
        return <Minus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-mood-excellent bg-mood-excellent/10";
      case "down":
        return "text-mood-very-low bg-mood-very-low/10";
      case "stable":
        return "text-mood-neutral bg-mood-neutral/10";
      default:
        return "";
    }
  };

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
              {trend && trendValue && (
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                    getTrendColor()
                  )}
                >
                  {getTrendIcon()}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
          </div>

          {Icon && (
            <div
              className={cn(
                "rounded-lg bg-primary/10 p-3",
                iconClassName
              )}
            >
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

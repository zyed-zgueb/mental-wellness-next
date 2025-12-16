"use client";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LayerConfig } from "@/lib/unified-timeline";
import { cn } from "@/lib/utils";

interface LayerTogglesProps {
  layers: LayerConfig[];
  onChange: (layers: LayerConfig[]) => void;
  className?: string;
}

export function LayerToggles({ layers, onChange, className }: LayerTogglesProps) {
  const toggleLayerVisibility = (layerId: string) => {
    const updatedLayers = layers.map((layer) => {
      if (layer.id === layerId) {
        return { ...layer, visible: !layer.visible };
      }
      return layer;
    });
    onChange(updatedLayers);
  };

  const visibleCount = layers.filter((l) => l.visible).length;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Affichage</h3>
        <span className="text-xs text-muted-foreground">
          {visibleCount}/{layers.length} visible{visibleCount > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-1">
        {layers.map((layer) => {
          const isVisible = layer.visible;

          return (
            <Button
              key={layer.id}
              variant={isVisible ? "default" : "outline"}
              size="sm"
              className={cn(
                "w-full justify-start gap-2 transition-all",
                !isVisible && "opacity-50"
              )}
              onClick={() => toggleLayerVisibility(layer.id)}
            >
              {isVisible ? (
                <Eye className="h-4 w-4 flex-shrink-0" />
              ) : (
                <EyeOff className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="text-base">{layer.icon}</span>
              <span className="flex-1 text-left text-sm">{layer.label}</span>
            </Button>
          );
        })}
      </div>

      {visibleCount === 0 && (
        <div className="mt-4 rounded-lg border border-dashed border-muted-foreground/50 p-3">
          <p className="text-xs text-center text-muted-foreground">
            Activez au moins un type pour voir des données
          </p>
        </div>
      )}
    </div>
  );
}

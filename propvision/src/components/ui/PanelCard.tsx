"use client";

import { ReactNode } from "react";

interface PanelCardProps {
  title: string;
  icon?: ReactNode;
  visible: boolean;
  loaded: boolean;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
}

export function PanelCard({
  title,
  icon,
  visible,
  loaded,
  children,
  className = "",
  headerRight,
}: PanelCardProps) {
  return (
    <div
      className={`panel-card ${visible ? "panel-visible" : "panel-hidden"} ${className}`}
      role="region"
      aria-label={title}
    >
      <div className="panel-header">
        <div className="flex items-center gap-2">
          {icon && <span className="text-accent">{icon}</span>}
          <h3 className="panel-title">{title}</h3>
        </div>
        {headerRight && <div>{headerRight}</div>}
      </div>
      <div className="panel-body">
        {children}
      </div>
    </div>
  );
}

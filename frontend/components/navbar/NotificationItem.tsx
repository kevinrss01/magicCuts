"use client";

import React from "react";
import { Avatar, Badge, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

export type NotificationType = "default" | "request" | "file";

export type NotificationItem = {
  id: string;
  isRead?: boolean;
  avatar: string;
  description: string;
  name: string;
  time: string;
  type?: NotificationType;
};

export type NotificationItemProps = React.HTMLAttributes<HTMLDivElement> &
  NotificationItem;

const NotificationItem = React.forwardRef<
  HTMLDivElement,
  NotificationItemProps
>(
  (
    {
      children,
      avatar,
      name,
      description,
      type,
      time,
      isRead,
      className,
      ...props
    },
    ref,
  ) => {
    /**
     * Defines the content for different types of notifications.
     */
    const contentByType: Record<NotificationType, React.ReactNode> = {
      default: null,
      request: (
        <div className="flex gap-2 pt-2">
          <Button color="primary" size="sm">
            Accept
          </Button>
          <Button size="sm" variant="flat">
            Decline
          </Button>
        </div>
      ),
      file: (
        <div className="flex items-center gap-2">
          <Icon
            className="text-secondary"
            icon="solar:figma-file-linear"
            width={30}
          />
          <div className="flex flex-col">
            <strong className="text-small font-medium">
              Brand_Logo_v1.2.fig
            </strong>
            <p className="text-tiny text-default-400">3.4 MB</p>
          </div>
        </div>
      ),
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-3 border-b border-divider px-6 py-4",
          {
            "bg-primary-50/50": !isRead,
          },
          className,
        )}
        {...props}
      >
        <div className="relative flex-none">
          <Badge
            color="primary"
            content=""
            isInvisible={isRead}
            placement="bottom-right"
            shape="circle"
          >
            <Avatar src={avatar} />
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-small text-foreground">
            <strong className="font-medium">{name}</strong>{" "}
            {description || children}
          </p>
          <time className="text-tiny text-default-400">{time}</time>
          {type && contentByType[type]}
        </div>
      </div>
    );
  },
);

NotificationItem.displayName = "NotificationItem";

export default NotificationItem;

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Avatar from "@/components/ui/avatar/Avatar";
import { Metadata } from "next";
import React from "react";
import { getUserAvatar } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Avatars",
  description: "Avatar component examples and usage.",
};

export default function AvatarPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Avatar" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Default Avatar">
          {/* Default Avatar (No Status) */}
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar src={getUserAvatar({ name: "User" })} size="xsmall" />
            <Avatar src={getUserAvatar({ name: "User" })} size="small" />
            <Avatar src={getUserAvatar({ name: "User" })} size="medium" />
            <Avatar src={getUserAvatar({ name: "User" })} size="large" />
            <Avatar src={getUserAvatar({ name: "User" })} size="xlarge" />
            <Avatar src={getUserAvatar({ name: "User" })} size="xxlarge" />
          </div>
        </ComponentCard>
        <ComponentCard title="Avatar with online indicator">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="xsmall"
              status="online"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="small"
              status="online"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="medium"
              status="online"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="large"
              status="online"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="xlarge"
              status="online"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="xxlarge"
              status="online"
            />
          </div>
        </ComponentCard>
        <ComponentCard title="Avatar with Offline indicator">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="xsmall"
              status="offline"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="small"
              status="offline"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="medium"
              status="offline"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="large"
              status="offline"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="xlarge"
              status="offline"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="xxlarge"
              status="offline"
            />
          </div>
        </ComponentCard>{" "}
        <ComponentCard title="Avatar with busy indicator">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="xsmall"
              status="busy"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="small"
              status="busy"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="medium"
              status="busy"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="large"
              status="busy"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="xlarge"
              status="busy"
            />
            <Avatar
              src={getUserAvatar({ name: "User" })}
              size="xxlarge"
              status="busy"
            />
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}

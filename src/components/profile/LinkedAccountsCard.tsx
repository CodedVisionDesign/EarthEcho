"use client";

import { signIn } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@/lib/fontawesome";
import { faCircleCheck, faLink } from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const PROVIDERS = [
  {
    id: "google",
    name: "Google",
    icon: faGoogle,
    iconColor: "text-[#4285F4]",
    btnClass:
      "border-gray-200 bg-white text-charcoal hover:bg-gray-50",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: faFacebook,
    iconColor: "text-[#1877F2]",
    btnClass:
      "border-[#1877F2] bg-[#1877F2] text-white hover:bg-[#166FE5]",
  },
] as const;

interface LinkedAccountsCardProps {
  linkedProviders: string[];
}

export function LinkedAccountsCard({ linkedProviders }: LinkedAccountsCardProps) {
  return (
    <Card variant="default" className="p-5">
      <div className="mb-3 flex items-center gap-2">
        <FontAwesomeIcon icon={faLink} className="h-3.5 w-3.5 text-slate" aria-hidden />
        <h3 className="text-sm font-semibold text-charcoal">Connected Accounts</h3>
      </div>
      <p className="mb-4 text-xs text-slate">
        Link social accounts for easier sign-in
      </p>

      <div className="space-y-2.5">
        {PROVIDERS.map((provider) => {
          const isLinked = linkedProviders.includes(provider.id);

          return (
            <div
              key={provider.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon
                  icon={provider.icon}
                  className={`h-4 w-4 ${provider.iconColor}`}
                  aria-hidden
                />
                <span className="text-sm font-medium text-charcoal">
                  {provider.name}
                </span>
              </div>

              {isLinked ? (
                <Badge variant="success" size="sm">
                  <FontAwesomeIcon icon={faCircleCheck} className="h-2.5 w-2.5" aria-hidden />
                  Connected
                </Badge>
              ) : (
                <button
                  type="button"
                  onClick={() => signIn(provider.id, { callbackUrl: "/profile" })}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${provider.btnClass}`}
                >
                  Link
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

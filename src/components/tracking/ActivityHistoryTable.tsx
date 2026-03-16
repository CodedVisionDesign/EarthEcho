"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faSpinner } from "@/lib/fontawesome";
import { deleteActivity } from "@/lib/actions";

interface Activity {
  id: string;
  type: string;
  value: number;
  unit: string;
  date: string;
  note?: string;
  transportMode?: string;
  distanceKm?: number;
}

interface ActivityHistoryTableProps {
  activities: Activity[];
  unitLabel: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function DeleteButton({ activityId }: { activityId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    startTransition(async () => {
      await deleteActivity(activityId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
      aria-label="Delete activity"
    >
      {isPending ? (
        <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5" spin />
      ) : (
        <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function ActivityHistoryTable({
  activities,
  unitLabel,
}: ActivityHistoryTableProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-slate">
          No activities logged yet. Start tracking to see your history here!
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">
                Date
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">
                Type
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">
                Value
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">
                Note
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate/70">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, i) => (
              <tr
                key={activity.id}
                className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                  i % 2 === 1 ? "bg-gray-50/30" : ""
                }`}
              >
                <td className="whitespace-nowrap px-4 py-3 text-charcoal">
                  {formatDate(activity.date)}
                </td>
                <td className="px-4 py-3 capitalize text-charcoal">
                  {activity.type.replace(/_/g, " ")}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-charcoal">
                  {activity.value} {unitLabel}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-slate">
                  {activity.note || "\u2014"}
                </td>
                <td className="px-4 py-3">
                  <DeleteButton activityId={activity.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

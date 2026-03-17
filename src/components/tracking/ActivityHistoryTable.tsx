"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faSpinner,
  faXmark,
  faSquareCheck,
  faSquare,
  faCircleCheck,
} from "@/lib/fontawesome";
import { deleteActivity, bulkDeleteActivities } from "@/lib/actions";

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

// -------------------------------------------------------------------
// Confirmation Modal
// -------------------------------------------------------------------

interface ConfirmDeleteModalProps {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

function ConfirmDeleteModal({
  count,
  onConfirm,
  onCancel,
  isPending,
}: ConfirmDeleteModalProps) {
  const requireTyping = count > 10;
  const [typed, setTyped] = useState("");
  const canConfirm = requireTyping ? typed === "DELETE" : true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-md p-1 text-slate hover:text-charcoal"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <FontAwesomeIcon icon={faTrashCan} className="h-5 w-5 text-red-600" />
        </div>

        <h3 className="mb-2 text-center text-lg font-semibold text-charcoal">
          Are you sure you want to delete {count} activit{count === 1 ? "y" : "ies"}?
        </h3>

        <p className="mb-4 text-center text-sm text-slate">
          This action cannot be undone. Your points will be recalculated.
        </p>

        {requireTyping && (
          <div className="mb-4">
            <label
              htmlFor="confirm-delete-input"
              className="mb-1 block text-sm font-medium text-charcoal"
            >
              Type <span className="font-bold text-red-600">DELETE</span> to confirm
            </label>
            <input
              id="confirm-delete-input"
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-charcoal focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              autoFocus
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirm || isPending}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5" spin />
                Deleting...
              </span>
            ) : (
              "Confirm Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Single-row Delete Button (unchanged behaviour)
// -------------------------------------------------------------------

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

// -------------------------------------------------------------------
// Swipeable Row (touch devices only)
// -------------------------------------------------------------------

const SWIPE_THRESHOLD = 80;

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
  className?: string;
}

function SwipeableRow({ children, onDelete, className = "" }: SwipeableRowProps) {
  const rowRef = useRef<HTMLTableRowElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isSwiping = useRef(false);
  const [offset, setOffset] = useState(0);
  const [showDelete, setShowDelete] = useState(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = startX.current;
    isSwiping.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - startX.current;

    // Only allow swiping left (negative direction)
    if (deltaX > 0) {
      if (showDelete) {
        // If delete is already showing, allow swiping back right to hide it
        const newOffset = Math.max(-SWIPE_THRESHOLD, deltaX - SWIPE_THRESHOLD);
        setOffset(newOffset);
      }
      return;
    }

    if (Math.abs(deltaX) > 10) {
      isSwiping.current = true;
    }

    currentX.current = e.touches[0].clientX;
    const clampedOffset = Math.max(-SWIPE_THRESHOLD - 20, deltaX);
    setOffset(clampedOffset);
  }, [showDelete]);

  const handleTouchEnd = useCallback(() => {
    if (offset < -(SWIPE_THRESHOLD / 2)) {
      setOffset(-SWIPE_THRESHOLD);
      setShowDelete(true);
    } else {
      setOffset(0);
      setShowDelete(false);
    }
  }, [offset]);

  const handleDeleteClick = useCallback(() => {
    setOffset(0);
    setShowDelete(false);
    onDelete();
  }, [onDelete]);

  return (
    <tr ref={rowRef} className={`relative ${className}`}>
      {/* Delete button revealed behind the row on mobile */}
      <td
        colSpan={100}
        className="pointer-events-none absolute inset-0 p-0 md:hidden"
        style={{ zIndex: 0 }}
      >
        <div className="flex h-full items-stretch justify-end">
          <button
            type="button"
            onClick={handleDeleteClick}
            className="pointer-events-auto flex w-20 items-center justify-center bg-red-600 text-white transition-colors hover:bg-red-700"
            aria-label="Delete activity"
          >
            <FontAwesomeIcon icon={faTrashCan} className="h-4 w-4" />
          </button>
        </div>
      </td>

      {/* Actual row content that slides */}
      {/* We render children inside a wrapper td to handle the transform */}
      <td
        colSpan={100}
        className="relative bg-inherit p-0 md:hidden"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isSwiping.current ? "none" : "transform 0.25s ease-out",
          zIndex: 1,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex w-full">
          {children}
        </div>
      </td>
    </tr>
  );
}

// -------------------------------------------------------------------
// Mobile Card Row (used inside SwipeableRow)
// -------------------------------------------------------------------

interface MobileCardRowProps {
  activity: Activity;
  unitLabel: string;
  isSelected: boolean;
  onToggle: () => void;
}

function MobileCardRow({ activity, unitLabel, isSelected, onToggle }: MobileCardRowProps) {
  return (
    <div className="flex w-full items-center gap-3 px-4 py-3">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="flex-shrink-0 text-lg"
        aria-label={isSelected ? "Deselect activity" : "Select activity"}
      >
        <FontAwesomeIcon
          icon={isSelected ? faSquareCheck : faSquare}
          className={isSelected ? "text-forest" : "text-gray-400"}
        />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-medium capitalize text-charcoal">
            {activity.type.replace(/_/g, " ")}
          </span>
          <span className="flex-shrink-0 text-sm font-semibold text-charcoal">
            {activity.value} {unitLabel}
          </span>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between gap-2 text-xs text-slate">
          <span>{formatDate(activity.date)}</span>
          {activity.note && (
            <span className="truncate">{activity.note}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Main Component
// -------------------------------------------------------------------

export function ActivityHistoryTable({
  activities,
  unitLabel,
}: ActivityHistoryTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bulkDeletePending, startBulkDeleteTransition] = useTransition();
  const [flashSuccess, setFlashSuccess] = useState(false);

  // Clear selection if activities change (e.g. after deletion)
  useEffect(() => {
    const activityIds = new Set(activities.map((a) => a.id));
    setSelectedIds((prev) => {
      const next = new Set<string>();
      prev.forEach((id) => {
        if (activityIds.has(id)) next.add(id);
      });
      return next.size === prev.size ? prev : next;
    });
  }, [activities]);

  // Selection helpers
  const allSelected = activities.length > 0 && selectedIds.size === activities.length;
  const someSelected = selectedIds.size > 0;

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(activities.map((a) => a.id)));
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Bulk delete flow
  function handleBulkDeleteClick() {
    if (selectedIds.size > 5) {
      setShowConfirmModal(true);
    } else {
      executeBulkDelete();
    }
  }

  function executeBulkDelete() {
    const ids = Array.from(selectedIds);
    startBulkDeleteTransition(async () => {
      const result = await bulkDeleteActivities(ids);
      setShowConfirmModal(false);
      if (result.success) {
        setSelectedIds(new Set());
        setFlashSuccess(true);
        setTimeout(() => setFlashSuccess(false), 2000);
        router.refresh();
      }
    });
  }

  // Single swipe-to-delete handler
  function handleSwipeDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this activity?")) return;
    deleteActivity(id).then(() => router.refresh());
  }

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
    <>
      {/* Success flash */}
      {flashSuccess && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
          <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" />
          Activities deleted successfully. Points recalculated.
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* =================== Desktop table =================== */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="w-10 px-4 py-3">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-lg leading-none"
                    aria-label={allSelected ? "Deselect all" : "Select all"}
                  >
                    <FontAwesomeIcon
                      icon={allSelected ? faSquareCheck : faSquare}
                      className={allSelected ? "text-forest" : "text-gray-400"}
                    />
                  </button>
                </th>
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
              {activities.map((activity, i) => {
                const isSelected = selectedIds.has(activity.id);
                return (
                  <tr
                    key={activity.id}
                    className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                      isSelected
                        ? "bg-forest/5"
                        : i % 2 === 1
                          ? "bg-gray-50/30"
                          : ""
                    }`}
                  >
                    <td className="w-10 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleSelect(activity.id)}
                        className="text-lg leading-none"
                        aria-label={isSelected ? "Deselect" : "Select"}
                      >
                        <FontAwesomeIcon
                          icon={isSelected ? faSquareCheck : faSquare}
                          className={isSelected ? "text-forest" : "text-gray-400"}
                        />
                      </button>
                    </td>
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* =================== Mobile list =================== */}
        <div className="md:hidden">
          {/* Select-all header */}
          <div className="flex items-center gap-3 border-b border-gray-200 bg-gray-50/50 px-4 py-3">
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-lg leading-none"
              aria-label={allSelected ? "Deselect all" : "Select all"}
            >
              <FontAwesomeIcon
                icon={allSelected ? faSquareCheck : faSquare}
                className={allSelected ? "text-forest" : "text-gray-400"}
              />
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate/70">
              {someSelected
                ? `${selectedIds.size} selected`
                : "Select all"}
            </span>
          </div>

          {/* Swipeable rows rendered as a table for semantic consistency */}
          <table className="w-full">
            <tbody>
              {activities.map((activity, i) => {
                const isSelected = selectedIds.has(activity.id);
                return (
                  <SwipeableRow
                    key={activity.id}
                    onDelete={() => handleSwipeDelete(activity.id)}
                    className={`border-b border-gray-100 ${
                      isSelected
                        ? "bg-forest/5"
                        : i % 2 === 1
                          ? "bg-gray-50/30"
                          : ""
                    }`}
                  >
                    <MobileCardRow
                      activity={activity}
                      unitLabel={unitLabel}
                      isSelected={isSelected}
                      onToggle={() => toggleSelect(activity.id)}
                    />
                  </SwipeableRow>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================== Bulk delete toolbar =================== */}
      {someSelected && (
        <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-xl">
            <span className="text-sm font-medium text-charcoal">
              {selectedIds.size} selected
            </span>

            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate transition-colors hover:bg-gray-100 hover:text-charcoal"
            >
              Clear Selection
            </button>

            <button
              type="button"
              onClick={handleBulkDeleteClick}
              disabled={bulkDeletePending}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {bulkDeletePending ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5" spin />
                  Deleting...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" />
                  Delete Selected
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =================== Confirmation modal =================== */}
      {showConfirmModal && (
        <ConfirmDeleteModal
          count={selectedIds.size}
          onConfirm={executeBulkDelete}
          onCancel={() => setShowConfirmModal(false)}
          isPending={bulkDeletePending}
        />
      )}
    </>
  );
}

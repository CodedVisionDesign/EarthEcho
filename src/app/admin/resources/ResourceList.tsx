"use client";

import { useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrashCan,
  faToggleOn,
  faToggleOff,
  faArrowUpRightFromSquare,
  faXmark,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  createResource,
  updateResource,
  deleteResource,
  toggleResourceActive,
} from "@/lib/resource-actions";

interface Resource {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  value: string;
  label: string;
}

interface ResourceListProps {
  resources: Resource[];
  categories: Category[];
}

export function ResourceList({ resources, categories }: ResourceListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      const result = await createResource(formData);
      if (result.success) setShowForm(false);
    });
  };

  const handleUpdate = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateResource(formData);
      if (result.success) setEditingId(null);
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      await deleteResource(id);
      setDeletingId(null);
    });
  };

  const handleToggle = async (id: string) => {
    startTransition(async () => {
      await toggleResourceActive(id);
    });
  };

  const editingResource = editingId
    ? resources.find((r) => r.id === editingId)
    : null;

  return (
    <div>
      {/* Add button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-forest/90"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
          Add Resource
        </button>
      </div>

      {/* Create / Edit Form */}
      {(showForm || editingId) && (
        <Card variant="default" className="mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-charcoal">
              {editingId ? "Edit Resource" : "New Resource"}
            </h3>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); }}
              className="text-slate hover:text-charcoal"
            >
              <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
            </button>
          </div>
          <form action={editingId ? handleUpdate : handleCreate} className="space-y-3">
            {editingId && <input type="hidden" name="id" value={editingId} />}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate">Name</label>
                <input
                  name="name"
                  defaultValue={editingResource?.name ?? ""}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                  placeholder="Resource name"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate">Category</label>
                <select
                  name="category"
                  defaultValue={editingResource?.category ?? ""}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">URL</label>
              <input
                name="url"
                type="url"
                defaultValue={editingResource?.url ?? ""}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">Image URL (optional)</label>
              <input
                name="image"
                type="url"
                defaultValue={editingResource?.image ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                placeholder="https://logo.clearbit.com/example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate">Description</label>
              <textarea
                name="description"
                defaultValue={editingResource?.description ?? ""}
                required
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                placeholder="Brief description"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-forest/90 disabled:opacity-50"
              >
                {isPending ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-slate transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Delete confirmation */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Card variant="default" className="mx-4 max-w-sm p-6">
            <h3 className="mb-2 text-base font-semibold text-charcoal">Delete Resource?</h3>
            <p className="mb-4 text-sm text-slate">
              This action cannot be undone. The resource will be permanently removed.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                disabled={isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-slate transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Resource list */}
      {resources.length === 0 ? (
        <Card variant="default" className="py-12 text-center">
          <p className="text-sm text-slate">No resources yet. Add your first resource above.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {resources.map((resource) => (
            <Card key={resource.id} variant="default" className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-charcoal">
                    {resource.name}
                  </span>
                  <Badge
                    variant={resource.isActive ? "success" : "neutral"}
                    size="sm"
                  >
                    {resource.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="info" size="sm">
                    {categories.find((c) => c.value === resource.category)?.label ?? resource.category}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate">{resource.description}</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-xs text-ocean hover:underline"
                >
                  {resource.url.replace(/^https?:\/\//, "").slice(0, 50)}
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="h-2.5 w-2.5" />
                </a>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleToggle(resource.id)}
                  disabled={isPending}
                  className="rounded-lg p-2 text-slate transition hover:bg-gray-100 disabled:opacity-50"
                  title={resource.isActive ? "Deactivate" : "Activate"}
                >
                  <FontAwesomeIcon
                    icon={resource.isActive ? faToggleOn : faToggleOff}
                    className={`h-5 w-5 ${resource.isActive ? "text-forest" : "text-slate"}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingId(resource.id); setShowForm(false); }}
                  className="rounded-lg p-2 text-slate transition hover:bg-gray-100"
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(resource.id)}
                  className="rounded-lg p-2 text-slate transition hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <FontAwesomeIcon icon={faTrashCan} className="h-3.5 w-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

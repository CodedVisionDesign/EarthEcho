"use client";

import { useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPen,
  faTrashCan,
  faToggleOn,
  faToggleOff,
  faXmark,
  faEye,
  faChevronDown,
  faChevronUp,
  faArrowUp,
  faArrowDown,
} from "@/lib/fontawesome";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  createGuide,
  updateGuide,
  deleteGuide,
  toggleGuidePublished,
} from "@/lib/guide-actions";

interface GuideSection {
  heading: string;
  paragraphs: string[];
  stats?: { figure: string; description: string; source: string }[];
  callout?: { type: string; content: string };
  list?: string[];
}

interface GuideSource {
  name: string;
  url: string;
}

interface Guide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  category: string;
  categoryLabel: string;
  readTimeMinutes: number;
  introduction: string;
  sections: string;
  quickTips: string;
  sources: string;
  lastUpdated: string;
  isPublished: boolean;
}

interface Category {
  value: string;
  label: string;
}

interface IconOption {
  value: string;
  label: string;
}

interface GuideListProps {
  guides: Guide[];
  categories: Category[];
  iconOptions: IconOption[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function GuideList({ guides, categories, iconOptions }: GuideListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form state for sections editor
  const [sections, setSections] = useState<GuideSection[]>([]);
  const [quickTips, setQuickTips] = useState<string[]>([]);
  const [sources, setSources] = useState<GuideSource[]>([]);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const resetFormState = () => {
    setSections([]);
    setQuickTips([]);
    setSources([]);
    setExpandedSection(null);
  };

  const openCreate = () => {
    resetFormState();
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (guide: Guide) => {
    setSections(JSON.parse(guide.sections));
    setQuickTips(JSON.parse(guide.quickTips));
    setSources(JSON.parse(guide.sources));
    setExpandedSection(null);
    setEditingId(guide.id);
    setShowForm(false);
  };

  const handleSubmit = async (formData: FormData) => {
    formData.set("sections", JSON.stringify(sections));
    formData.set("quickTips", JSON.stringify(quickTips));
    formData.set("sources", JSON.stringify(sources));

    startTransition(async () => {
      if (editingId) {
        const result = await updateGuide(formData);
        if (result.success) { setEditingId(null); resetFormState(); }
      } else {
        const result = await createGuide(formData);
        if (result.success) { setShowForm(false); resetFormState(); }
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      await deleteGuide(id);
      setDeletingId(null);
    });
  };

  const handleToggle = async (id: string) => {
    startTransition(async () => {
      await toggleGuidePublished(id);
    });
  };

  const editingGuide = editingId ? guides.find((g) => g.id === editingId) : null;

  // Section helpers
  const addSection = () => {
    setSections([...sections, { heading: "", paragraphs: [""] }]);
    setExpandedSection(sections.length);
  };

  const removeSection = (i: number) => {
    setSections(sections.filter((_, idx) => idx !== i));
    setExpandedSection(null);
  };

  const moveSection = (i: number, dir: -1 | 1) => {
    const newSections = [...sections];
    const j = i + dir;
    if (j < 0 || j >= newSections.length) return;
    [newSections[i], newSections[j]] = [newSections[j], newSections[i]];
    setSections(newSections);
    setExpandedSection(j);
  };

  const updateSection = (i: number, field: string, value: unknown) => {
    const newSections = [...sections];
    (newSections[i] as unknown as Record<string, unknown>)[field] = value;
    setSections(newSections);
  };

  return (
    <div>
      {/* Add button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-forest/90"
        >
          <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" />
          New Guide
        </button>
      </div>

      {/* Create / Edit Form */}
      {(showForm || editingId) && (
        <Card variant="default" className="mb-6 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-charcoal">
              {editingId ? "Edit Guide" : "New Guide"}
            </h3>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditingId(null); resetFormState(); }}
              className="text-slate hover:text-charcoal"
            >
              <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
            </button>
          </div>

          <form action={handleSubmit} className="space-y-4">
            {editingId && <input type="hidden" name="id" value={editingId} />}

            {/* Basic fields */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate">Title</label>
                <input
                  name="title"
                  defaultValue={editingGuide?.title ?? ""}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate">Slug</label>
                <input
                  name="slug"
                  defaultValue={editingGuide?.slug ?? ""}
                  required
                  placeholder="auto-generated-from-title"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate">Subtitle</label>
              <input
                name="subtitle"
                defaultValue={editingGuide?.subtitle ?? ""}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate">Category</label>
                <select
                  name="category"
                  defaultValue={editingGuide?.category ?? ""}
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="">Select</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate">Category Label</label>
                <input
                  name="categoryLabel"
                  defaultValue={editingGuide?.categoryLabel ?? ""}
                  placeholder="Display name"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate">Icon</label>
                <select
                  name="icon"
                  defaultValue={editingGuide?.icon ?? "faBookOpen"}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  {iconOptions.map((ic) => (
                    <option key={ic.value} value={ic.value}>{ic.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate">Read Time (min)</label>
                <input
                  name="readTimeMinutes"
                  type="number"
                  min={1}
                  defaultValue={editingGuide?.readTimeMinutes ?? 5}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate">Introduction</label>
              <textarea
                name="introduction"
                defaultValue={editingGuide?.introduction ?? ""}
                required
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
              />
            </div>

            {/* Publish toggle */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate">Published</label>
              <input
                type="hidden"
                name="isPublished"
                value={editingGuide ? String(editingGuide.isPublished) : "true"}
              />
              <select
                name="isPublished"
                defaultValue={editingGuide ? String(editingGuide.isPublished) : "true"}
                className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-forest focus:outline-none"
              >
                <option value="true">Yes</option>
                <option value="false">No (Draft)</option>
              </select>
            </div>

            {/* Sections Editor */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-slate">
                  Sections ({sections.length})
                </label>
                <button
                  type="button"
                  onClick={addSection}
                  className="inline-flex items-center gap-1 text-xs font-medium text-forest hover:underline"
                >
                  <FontAwesomeIcon icon={faPlus} className="h-2.5 w-2.5" /> Add Section
                </button>
              </div>

              <div className="space-y-2">
                {sections.map((section, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 bg-gray-50/50">
                    <div
                      className="flex cursor-pointer items-center justify-between px-3 py-2"
                      onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                    >
                      <span className="text-sm font-medium text-charcoal">
                        {section.heading || `Section ${i + 1}`}
                      </span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={(e) => { e.stopPropagation(); moveSection(i, -1); }} className="p-1 text-slate hover:text-charcoal" disabled={i === 0}>
                          <FontAwesomeIcon icon={faArrowUp} className="h-3 w-3" />
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); moveSection(i, 1); }} className="p-1 text-slate hover:text-charcoal" disabled={i === sections.length - 1}>
                          <FontAwesomeIcon icon={faArrowDown} className="h-3 w-3" />
                        </button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeSection(i); }} className="p-1 text-red-500 hover:text-red-700">
                          <FontAwesomeIcon icon={faTrashCan} className="h-3 w-3" />
                        </button>
                        <FontAwesomeIcon
                          icon={expandedSection === i ? faChevronUp : faChevronDown}
                          className="ml-1 h-3 w-3 text-slate"
                        />
                      </div>
                    </div>

                    {expandedSection === i && (
                      <div className="space-y-2 border-t border-gray-200 px-3 py-3">
                        <input
                          value={section.heading}
                          onChange={(e) => updateSection(i, "heading", e.target.value)}
                          placeholder="Section heading"
                          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-forest focus:outline-none"
                        />
                        <div>
                          <label className="mb-1 block text-[10px] font-medium text-slate">Paragraphs (one per line)</label>
                          <textarea
                            value={section.paragraphs.join("\n\n")}
                            onChange={(e) => updateSection(i, "paragraphs", e.target.value.split("\n\n").filter(Boolean))}
                            rows={4}
                            className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-forest focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-medium text-slate">Bullet list (one per line, optional)</label>
                          <textarea
                            value={(section.list ?? []).join("\n")}
                            onChange={(e) => updateSection(i, "list", e.target.value ? e.target.value.split("\n") : undefined)}
                            rows={2}
                            className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-forest focus:outline-none"
                            placeholder="Optional bullet points"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-slate">Quick Tips ({quickTips.length})</label>
                <button
                  type="button"
                  onClick={() => setQuickTips([...quickTips, ""])}
                  className="inline-flex items-center gap-1 text-xs font-medium text-forest hover:underline"
                >
                  <FontAwesomeIcon icon={faPlus} className="h-2.5 w-2.5" /> Add Tip
                </button>
              </div>
              <div className="space-y-2">
                {quickTips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <input
                      value={tip}
                      onChange={(e) => {
                        const newTips = [...quickTips];
                        newTips[i] = e.target.value;
                        setQuickTips(newTips);
                      }}
                      className="flex-1 rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-forest focus:outline-none"
                      placeholder="Quick tip"
                    />
                    <button
                      type="button"
                      onClick={() => setQuickTips(quickTips.filter((_, idx) => idx !== i))}
                      className="mt-1 text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-slate">Sources ({sources.length})</label>
                <button
                  type="button"
                  onClick={() => setSources([...sources, { name: "", url: "" }])}
                  className="inline-flex items-center gap-1 text-xs font-medium text-forest hover:underline"
                >
                  <FontAwesomeIcon icon={faPlus} className="h-2.5 w-2.5" /> Add Source
                </button>
              </div>
              <div className="space-y-2">
                {sources.map((source, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <input
                      value={source.name}
                      onChange={(e) => {
                        const newSources = [...sources];
                        newSources[i] = { ...newSources[i], name: e.target.value };
                        setSources(newSources);
                      }}
                      className="flex-1 rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-forest focus:outline-none"
                      placeholder="Source name"
                    />
                    <input
                      value={source.url}
                      onChange={(e) => {
                        const newSources = [...sources];
                        newSources[i] = { ...newSources[i], url: e.target.value };
                        setSources(newSources);
                      }}
                      className="flex-1 rounded border border-gray-200 px-2 py-1.5 text-sm focus:border-forest focus:outline-none"
                      placeholder="https://..."
                    />
                    <button
                      type="button"
                      onClick={() => setSources(sources.filter((_, idx) => idx !== i))}
                      className="mt-1 text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white transition hover:bg-forest/90 disabled:opacity-50"
              >
                {isPending ? "Saving..." : editingId ? "Update Guide" : "Create Guide"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); resetFormState(); }}
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
            <h3 className="mb-2 text-base font-semibold text-charcoal">Delete Guide?</h3>
            <p className="mb-4 text-sm text-slate">
              This will permanently delete the guide and all its content. Comments will be orphaned.
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

      {/* Guide list */}
      {guides.length === 0 ? (
        <Card variant="default" className="py-12 text-center">
          <p className="text-sm text-slate">No guides yet. Create your first guide above.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {guides.map((guide) => (
            <Card key={guide.id} variant="default" className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-charcoal">{guide.title}</span>
                  <Badge
                    variant={guide.isPublished ? "success" : "warning"}
                    size="sm"
                  >
                    {guide.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Badge variant="info" size="sm">
                    {guide.categoryLabel}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-slate">
                  /{guide.slug} · {guide.readTimeMinutes} min read · Updated {guide.lastUpdated}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <a
                  href={`/guides/${guide.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-slate transition hover:bg-gray-100"
                  title="Preview"
                >
                  <FontAwesomeIcon icon={faEye} className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleToggle(guide.id)}
                  disabled={isPending}
                  className="rounded-lg p-2 text-slate transition hover:bg-gray-100 disabled:opacity-50"
                  title={guide.isPublished ? "Unpublish" : "Publish"}
                >
                  <FontAwesomeIcon
                    icon={guide.isPublished ? faToggleOn : faToggleOff}
                    className={`h-5 w-5 ${guide.isPublished ? "text-forest" : "text-slate"}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(guide)}
                  className="rounded-lg p-2 text-slate transition hover:bg-gray-100"
                  title="Edit"
                >
                  <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(guide.id)}
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

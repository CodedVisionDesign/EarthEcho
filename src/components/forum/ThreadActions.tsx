"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { faPen } from "@/lib/fontawesome";
import { deleteThread } from "@/lib/actions";
import { EditThreadForm } from "./EditThreadForm";
import { DeleteConfirmButton } from "./DeleteConfirmButton";

interface ThreadActionsProps {
  threadId: string;
  title: string;
  content: string;
}

export function ThreadActions({ threadId, title, content }: ThreadActionsProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <EditThreadForm
        threadId={threadId}
        initialTitle={title}
        initialContent={content}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" leftIcon={faPen} onClick={() => setEditing(true)}>
        Edit
      </Button>
      <DeleteConfirmButton
        onDelete={() => deleteThread(threadId)}
        redirectTo="/forum"
      />
    </div>
  );
}

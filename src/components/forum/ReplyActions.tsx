"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { faPen } from "@/lib/fontawesome";
import { deleteReply } from "@/lib/actions";
import { EditReplyForm } from "./EditReplyForm";
import { DeleteConfirmButton } from "./DeleteConfirmButton";

interface ReplyActionsProps {
  replyId: string;
  content: string;
}

export function ReplyActions({ replyId, content }: ReplyActionsProps) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <EditReplyForm
        replyId={replyId}
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
      <DeleteConfirmButton onDelete={() => deleteReply(replyId)} />
    </div>
  );
}

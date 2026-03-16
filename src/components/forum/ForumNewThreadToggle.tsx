"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { faPlus, faXmark } from "@/lib/fontawesome";
import { CreateThreadForm } from "./CreateThreadForm";

export function ForumNewThreadToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <Button
        variant={isOpen ? "secondary" : "primary"}
        size="sm"
        leftIcon={isOpen ? faXmark : faPlus}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "Cancel" : "New Thread"}
      </Button>
      {isOpen && (
        <div className="mt-4">
          <CreateThreadForm />
        </div>
      )}
    </div>
  );
}

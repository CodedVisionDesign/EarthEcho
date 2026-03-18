"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { faPlus, faXmark } from "@/lib/fontawesome";
import { CreateThreadForm } from "./CreateThreadForm";

export function ForumNewThreadToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={isOpen ? "secondary" : "primary"}
        size="sm"
        leftIcon={isOpen ? faXmark : faPlus}
        onClick={() => setIsOpen(!isOpen)}
        className="shrink-0"
      >
        {isOpen ? "Cancel" : "New Thread"}
      </Button>
      {isOpen && (
        <div className="col-span-full mt-4 sm:col-span-1">
          <CreateThreadForm />
        </div>
      )}
    </>
  );
}

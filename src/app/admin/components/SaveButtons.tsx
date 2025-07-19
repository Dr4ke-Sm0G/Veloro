import { Button } from "@/components/ui/button";
import { Save, Upload } from "lucide-react";

interface SaveButtonsProps {
  onSave: () => void;
  onPublish: () => void;
  loading?: boolean;
}

export default function SaveButtons({
  onSave,
  onPublish,
  loading,
}: SaveButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onSave}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        Enregistrer
      </Button>
      <Button
        variant="secondary"
        onClick={onPublish}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Publier
      </Button>
    </div>
  );
}
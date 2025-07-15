// SaveButtons “simple”
import { Button } from "@/components/ui/button";
import { Save, Upload } from "lucide-react";

export default function SaveButtons({ loading }: { loading?: boolean }) {
  return (
    <div className="flex gap-2">
<Button
  type="submit"
  onClick={() => console.log("👉 BOUTON CLIQUÉ")}
>
  Enregistrer
</Button>
    </div>
  );
}

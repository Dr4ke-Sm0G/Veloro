// components/filters/BodyDriveFilters.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VariantFilterInput } from "@/store/filter-store";

const bodyTypes = ["Hatchback", "SUV", "Sedan", "Estate", "Coupé", "Convertible", "MPV", "Pickup"];
const driveTypes = [
  { label: "FWD", value: "Front" },
  { label: "RWD", value: "Rear" },
  { label: "AWD", value: "AWD" },
  { label: "4WD", value: "4WD" }, ];

const seatOptions = [2, 4, 5, 6, 7,8,9];

interface BodyDriveFiltersProps {
  filters: VariantFilterInput;
  onChange: <K extends keyof VariantFilterInput>(key: K, value: VariantFilterInput[K]) => void;
}


export function BodyDriveFilters({ filters, onChange }: BodyDriveFiltersProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Body Type</Label>
        <Select onValueChange={(val) => onChange("bodyType", val)} value={filters.bodyType ?? ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select body type" />
          </SelectTrigger>
          <SelectContent>
            {bodyTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Drive Type</Label>
        <Select onValueChange={(val) => onChange("drive", val)} value={filters.drive ?? ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select drive type" />
          </SelectTrigger>
          <SelectContent>
{driveTypes.map(({ label, value }) => (
  <SelectItem key={value} value={value}>{label}</SelectItem>
))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Number of Seats</Label>
        <Select onValueChange={(val) => onChange("seats", Number(val))} value={filters.seats?.toString() ?? ""}>
          <SelectTrigger>
            <SelectValue placeholder="Select seats" />
          </SelectTrigger>
          <SelectContent>
            {seatOptions.map((n) => (
              <SelectItem key={n} value={n.toString()}>{n} seats</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
<Checkbox
  id="towHitchPossible"
  checked={filters.towHitchPossible ?? false}
  onCheckedChange={(val) => onChange("towHitchPossible", val === true)}
/>          <Label htmlFor="towHitchPossible">Tow Hitch</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="evPlatform" checked={filters.evDedicatedPlatform ?? false} onCheckedChange={(val) => onChange("evDedicatedPlatform", val == true)} />
          <Label htmlFor="evPlatform">EV Platform</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="roofRails" checked={filters.roofRails ?? false} onCheckedChange={(val) => onChange("roofRails", val == true)} />
          <Label htmlFor="roofRails">Roof Rails</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="heatPump" checked={filters.heatPump ?? false} onCheckedChange={(val) => onChange("heatPump", val === true)} />
          <Label htmlFor="heatPump">Heat Pump</Label>
        </div>
      </div>
    </div>
  );
}

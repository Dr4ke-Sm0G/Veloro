"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export interface Price {
  country: string;
  price: number;
}

interface PricingFormProps {
  prices: Price[];
  onPricesChange: (prices: Price[]) => void;
}

const COUNTRY_OPTIONS = ["Germany", "Netherlands", "United Kingdom"];

export default function PricingForm({ prices, onPricesChange }: PricingFormProps) {
  const [newCountry, setNewCountry] = useState(COUNTRY_OPTIONS[0]);
  const [newPrice, setNewPrice] = useState("");

  const handleAdd = () => {
    const priceNum = parseFloat(newPrice);
    if (!newCountry || isNaN(priceNum)) return;

    onPricesChange([...prices, { country: newCountry, price: priceNum }]);
    setNewPrice("");
  };

  const handleChange = (index: number, field: keyof Price, value: string) => {
    const updated = [...prices];
    updated[index] = {
      ...updated[index],
      [field]: field === "price" ? parseFloat(value) || 0 : value,
    };
    onPricesChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = prices.filter((_, i) => i !== index);
    onPricesChange(updated);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Formulaire d'ajout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label>Pays</Label>
            <select
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Prix (€ ou £)</Label>
            <Input
              type="number"
              step="any"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
          </div>

          <div>
            <Button type="button" onClick={handleAdd} className="mt-2">
              Ajouter
            </Button>
          </div>
        </div>

        {/* Liste des prix */}
        {prices.map((price, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 items-center">
            <div>
              <Input
                value={price.country}
                onChange={(e) => handleChange(index, "country", e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                step="any"
                value={price.price}
                onChange={(e) => handleChange(index, "price", e.target.value)}
              />
            </div>
            <div>
              <Button variant="ghost" type="button" onClick={() => handleRemove(index)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

"use client";
import { useState } from "react";
import { Plus, Trash2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn, nepaliNumberFormat } from "@/lib/utils";

interface BOQItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

const UNIT_OPTIONS = ["m²", "m³", "m", "nos", "kg", "bags", "ls", "rft"];

const PRESET_ITEMS = [
  { description: "Excavation in ordinary soil", unit: "m³", rate: 350 },
  { description: "PCC 1:3:6 in foundation", unit: "m³", rate: 8500 },
  { description: "RCC 1:2:4 in columns", unit: "m³", rate: 18000 },
  { description: "Brickwork in CM 1:6", unit: "m³", rate: 6500 },
  { description: "Plastering 12mm 1:4", unit: "m²", rate: 350 },
  { description: "Flooring tiles", unit: "m²", rate: 1200 },
  { description: "Roof waterproofing", unit: "m²", rate: 850 },
  { description: "Steel reinforcement", unit: "kg", rate: 120 },
];

export default function BOQGenerator() {
  const [items, setItems] = useState<BOQItem[]>([]);
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("m²");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addItem = () => {
    setError(null);
    if (!description.trim()) return setError("Please enter a description.");
    const qty = parseFloat(quantity);
    const rt = parseFloat(rate);
    if (!qty || qty <= 0) return setError("Enter a valid quantity.");
    if (!rt || rt <= 0) return setError("Enter a valid rate.");

    const newItem: BOQItem = {
      id: Date.now().toString(),
      description: description.trim(),
      unit,
      quantity: qty,
      rate: rt,
      amount: qty * rt,
    };
    setItems([...items, newItem]);
    setDescription("");
    setQuantity("");
    setRate("");
  };

  const addPreset = (preset: typeof PRESET_ITEMS[0]) => {
    setDescription(preset.description);
    setUnit(preset.unit);
    setRate(preset.rate.toString());
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const total = items.reduce((sum, i) => sum + i.amount, 0);
  const contingency = total * 0.05;
  const grandTotal = total + contingency;

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Project Name */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Project Name (optional)</Label>
            <Input
              placeholder="e.g. My House Construction"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Preset items */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Quick Add Presets
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_ITEMS.map((p) => (
              <button
                key={p.description}
                onClick={() => addPreset(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                {p.description}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add item form */}
      <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Add BOQ Item</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <Label className="text-sm font-medium mb-2 block">Description</Label>
            <Input
              placeholder="Work item description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Unit</Label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Quantity</Label>
            <Input
              type="number"
              placeholder="e.g. 50"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="rounded-xl"
              min={0}
            />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Rate (NPR)</Label>
            <Input
              type="number"
              placeholder="e.g. 1200"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="rounded-xl"
              min={0}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2 mb-3">
            {error}
          </p>
        )}

        <Button
          onClick={addItem}
          className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* BOQ Table */}
      {items.length > 0 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-border/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">
              {projectName || "Bill of Quantities"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="rounded-xl gap-2"
            >
              <Download className="w-4 h-4" />
              Print / Save
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Unit</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Qty</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rate</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={cn(
                      "border-b border-border/50 hover:bg-secondary/30 transition-colors",
                      idx % 2 === 0 ? "" : "bg-secondary/20"
                    )}
                  >
                    <td className="py-3 px-3 text-muted-foreground">{idx + 1}</td>
                    <td className="py-3 px-3 font-medium">{item.description}</td>
                    <td className="py-3 px-3 text-center text-muted-foreground">{item.unit}</td>
                    <td className="py-3 px-3 text-right font-mono">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">{nepaliNumberFormat(item.rate)}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold">
                      {nepaliNumberFormat(item.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono font-medium">Rs. {nepaliNumberFormat(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contingency (5%)</span>
                <span className="font-mono font-medium">Rs. {nepaliNumberFormat(contingency)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t border-border pt-2">
                <span>Grand Total</span>
                <span className="font-mono text-orange-600 dark:text-orange-400">
                  Rs. {nepaliNumberFormat(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-border p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-8 h-8 text-orange-400" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">No items added yet</p>
          <p className="text-xs text-muted-foreground">
            Add items above or use presets to build your BOQ
          </p>
        </div>
      )}
    </div>
  );
}
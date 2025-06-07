import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Expense,
  Category,
  formatDateToString,
} from "@/services/expenseService";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import { log } from "console";

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, "id"> | Expense) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  selectedDate: Date;
  expenseToEdit?: Expense;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  onAddCategory,
  selectedDate,
  expenseToEdit,
}) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [notes, setNotes] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  // Filter out duplicate categories based on name
  const uniqueCategories = categories.reduce((acc: Category[], current) => {
    const x = acc.find((item) => item.name === current.name);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  // Reset form when opened or when expense to edit changes
  useEffect(() => {
    if (isOpen && expenseToEdit) {
      setTitle(expenseToEdit.title || "");
      setAmount(expenseToEdit.amount.toString() || "");

      const category = uniqueCategories.find(
        (c) => c.name === expenseToEdit.category
      );
      if (category) {
        setCategoryId(category.id);
      } else {
        setCategoryId("");
      }
      setNotes(expenseToEdit.notes || "");
    }
  }, [expenseToEdit]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategoryId("");
    setNotes("");
    setNewCategory("");
    setShowCategoryInput(false);
  };

  const handleSave = () => {
    // Basic validation
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!categoryId) {
      toast.error("Please select a category");
      return;
    }

    const selectedCategory = uniqueCategories.find((c) => c.id === categoryId);
    if (!selectedCategory) {
      toast.error("Selected category not found");
      return;
    }

    const expenseData = {
      title: title.trim(),
      amount: parseFloat(amount),
      category: selectedCategory.name,
      notes: notes.trim(),
      date: formatDateToString(selectedDate),
      ...(expenseToEdit && {
        id: expenseToEdit.id,
        userId: expenseToEdit.userId,
      }),
    };

    onSave(expenseData as any);
    resetForm();
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    onAddCategory(newCategory.trim());
    setNewCategory("");
    setShowCategoryInput(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and a single decimal point
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (showCategoryInput) {
        handleAddCategory();
      } else {
        handleSave();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {expenseToEdit ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-white">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              onKeyPress={handleKeyPress}
              placeholder="What did you spend on?"
              className="bg-secondary border-border text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount" className="text-white">
              Amount (₹)
            </Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              onKeyPress={handleKeyPress}
              placeholder="0.00"
              className="bg-secondary border-border text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category" className="text-white">
              Category
            </Label>
            {showCategoryInput ? (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                  onKeyPress={handleKeyPress}
                  placeholder="New category name"
                  className="bg-secondary border-border text-white"
                />
                <Button onClick={handleAddCategory} type="button">
                  Add
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCategoryInput(false);
                    setNewCategory("");
                  }}
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="bg-secondary border-border text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-secondary border-border">
                    <ScrollArea className="h-[200px]">
                      {uniqueCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setShowCategoryInput(true)}
                  className="flex items-center"
                  type="button"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-white">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Any additional details..."
              className="bg-secondary border-border text-white"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm;

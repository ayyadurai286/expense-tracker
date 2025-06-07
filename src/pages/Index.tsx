
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/Header';
import ExpenseSummary from '@/components/ExpenseSummary';
import ExpenseList from '@/components/ExpenseList';
import ExpenseForm from '@/components/ExpenseForm';
import ProfileSection from '@/components/ProfileSection';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Expense, 
  Category,
  getExpensesByDate,
  getTotalExpensesByDate,
  getAllCategories,
  addExpense,
  updateExpense,
  deleteExpense,
  addCategory,
  initializeFirestore
} from '@/services/expenseService';
import { toast } from 'sonner';

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState<boolean>(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // For delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  // Initialize Firestore categories for the user
  useEffect(() => {
    const init = async () => {
      try {
        await initializeFirestore();
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        toast.error('Failed to initialize app data');
      }
    };
    
    init();
  }, []);

  // Load expenses and categories when selected date changes
  useEffect(() => {
    loadExpensesForDate(selectedDate);
    loadCategories();
  }, [selectedDate]);

  const loadExpensesForDate = async (date: Date) => {
    setIsLoading(true);
    try {
      const expensesForDate = await getExpensesByDate(date);
      const total = await getTotalExpensesByDate(date);
      
      setExpenses(expensesForDate);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const allCategories = await getAllCategories();
      setCategories(allCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleAddExpense = () => {
    setExpenseToEdit(undefined);
    setIsExpenseFormOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsExpenseFormOpen(true);
  };

  const handleSaveExpense = async (expenseData: Omit<Expense, 'id'> | Expense) => {
    try {
      if ('id' in expenseData) {
        // Update existing expense
        await updateExpense(expenseData);
        toast.success('Expense updated successfully');
      } else {
        // Add new expense
        await addExpense(expenseData);
        toast.success('Expense added successfully');
      }
      
      // Refresh expense data
      await loadExpensesForDate(selectedDate);
    } catch (error) {
      console.error('Error saving expense:', error);
      toast.error('Failed to save expense');
    }
  };

  const handleDeleteExpense = (id: string) => {
    // Instead of deleting immediately, open confirmation dialog
    setExpenseToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteExpense = async () => {
    if (expenseToDelete) {
      try {
        await deleteExpense(expenseToDelete);
        toast.success('Expense deleted successfully');
        
        // Refresh expense data
        await loadExpensesForDate(selectedDate);
      } catch (error) {
        console.error('Error deleting expense:', error);
        toast.error('Failed to delete expense');
      } finally {
        // Close dialog and reset state
        setIsDeleteDialogOpen(false);
        setExpenseToDelete(null);
      }
    }
  };

  const handleAddCategory = async (name: string) => {
    try {
      await addCategory(name);
      toast.success(`Category "${name}" added`);
      await loadCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  // Show profile section
  if (showProfile) {
    return <ProfileSection onBack={() => setShowProfile(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onProfileClick={() => setShowProfile(true)}
      />
      
      <main className="container mx-auto p-4 max-w-md">
        <ExpenseSummary totalAmount={totalAmount} date={selectedDate} />
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ExpenseList 
            expenses={expenses}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}
        
        <Button 
          className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg"
          onClick={handleAddExpense}
        >
          <Plus className="h-6 w-6" />
        </Button>
        
        <ExpenseForm 
          isOpen={isExpenseFormOpen}
          onClose={() => setIsExpenseFormOpen(false)}
          onSave={handleSaveExpense}
          categories={categories}
          onAddCategory={handleAddCategory}
          selectedDate={selectedDate}
          expenseToEdit={expenseToEdit}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this expense? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteExpense} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default Index;

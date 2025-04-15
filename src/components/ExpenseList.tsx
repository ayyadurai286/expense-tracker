
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Expense } from '@/services/expenseService';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseListProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  onEditExpense, 
  onDeleteExpense 
}) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No expenses found for this date</p>
        <p className="text-gray-400 text-sm mt-2">Add an expense using the + button below</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {expenses.map((expense) => (
        <div 
          key={expense.id} 
          className="expense-entry flex justify-between items-center"
        >
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="expense-title">{expense.title}</h3>
              <span className="expense-amount">{formatCurrency(expense.amount)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="expense-category">{expense.category}</span>
              
              {expense.notes && (
                <p className="text-sm text-gray-400 mt-1 truncate max-w-[200px]">
                  {expense.notes}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex ml-4 space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEditExpense(expense)}
              className="h-8 w-8 text-gray-400 hover:text-primary"
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDeleteExpense(expense.id)}
              className="h-8 w-8 text-gray-400 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;

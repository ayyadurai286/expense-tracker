
import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from './ui/scroll-area';

interface HeaderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedDate, onDateChange, onProfileClick }) => {
  const isMobile = useIsMobile();
  
  // Disable future dates
  const isDateInFuture = (date: Date) => {
    return date > new Date(new Date().setHours(23, 59, 59, 999));
  };

  const handlePreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    const nextDay = addDays(selectedDate, 1);
    if (!isDateInFuture(nextDay)) {
      onDateChange(nextDay);
    }
  };

  const isNextDayDisabled = isDateInFuture(addDays(selectedDate, 1));
  const today = format(new Date(), 'yyyy-MM-dd');
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const isToday = today === selectedDateStr;

  return (
    <header className="bg-secondary shadow-md p-4 sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-primary">Expense Chronicle</h1>
        
        <div className="flex items-center w-full sm:w-auto">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handlePreviousDay}
            className="mr-1"
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn(
                "h-10 text-left font-normal",
                isMobile ? "flex-1 px-2 text-sm" : "pl-3"
              )}>
                <Calendar className={cn("h-4 w-4", isMobile ? "mr-1" : "mr-2")} />
                <span className="truncate">
                  {format(selectedDate, isMobile ? 'MMM d' : 'MMMM do, yyyy')}
                  {isToday && <span className="today-badge ml-1 hidden sm:inline-flex">Today</span>}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <ScrollArea className="h-[280px] w-full">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && onDateChange(date)}
                  disabled={isDateInFuture}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </ScrollArea>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleNextDay}
            disabled={isNextDayDisabled}
            className={cn("ml-1", isNextDayDisabled && "opacity-50 cursor-not-allowed")}
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onProfileClick}
            className="rounded-full ml-auto sm:ml-4"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

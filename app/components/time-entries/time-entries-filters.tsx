'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DateRange } from "react-day-picker";

interface TimeEntriesFiltersProps {
  onFiltersChange: (filters: TimeEntriesFilters) => void;
  onReset: () => void;
}

export interface TimeEntriesFilters {
  dateRange?: DateRange;
  status?: 'onTime' | 'late' | 'all';
}

export function TimeEntriesFilters({ onFiltersChange, onReset }: TimeEntriesFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [status, setStatus] = useState<'onTime' | 'late' | 'all'>('all');

  const handleFiltersChange = () => {
    onFiltersChange({
      dateRange,
      status
    });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-muted/10 rounded-lg">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filtres</span>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yy", { locale: fr })} -{" "}
                  {format(dateRange.to, "dd/MM/yy", { locale: fr })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yy", { locale: fr })
              )
            ) : (
              "Sélectionner les dates"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              setDateRange(range);
              handleFiltersChange();
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Select
        value={status}
        onValueChange={(value: 'onTime' | 'late' | 'all') => {
          setStatus(value);
          handleFiltersChange();
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="onTime">À l'heure</SelectItem>
          <SelectItem value="late">En retard</SelectItem>
        </SelectContent>
      </Select>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onReset}
        className="ml-auto"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
} 
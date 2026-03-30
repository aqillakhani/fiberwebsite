'use client';

import { useState, useMemo } from 'react';

interface DatePickerProps {
  onSelect: (date: string, time: 'morning' | 'afternoon' | 'no-preference') => void;
  selectedDate?: string;
  selectedTime?: 'morning' | 'afternoon' | 'no-preference';
}

export function DatePicker({
  onSelect,
  selectedDate,
  selectedTime = 'no-preference',
}: DatePickerProps) {
  const [localSelectedTime, setLocalSelectedTime] = useState<'morning' | 'afternoon' | 'no-preference'>(
    selectedTime || 'no-preference'
  );

  // Generate available dates (skip weekends, minimum 3-4 business days from today)
  const availableDates = useMemo(() => {
    const dates: { date: string; display: string }[] = [];
    const today = new Date();

    // Start from 3-4 business days from now
    let dayOffset = 0;
    let businessDaysSkipped = 0;

    // Skip to 3 business days from today
    while (businessDaysSkipped < 3) {
      dayOffset++;
      const d = new Date(today);
      d.setDate(d.getDate() + dayOffset);
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDaysSkipped++;
      }
    }

    // Collect dates for next 3 weeks (21 days, but only business days)
    const maxOffset = dayOffset + 21;

    for (let i = dayOffset; i <= maxOffset; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();

      // Only include weekdays
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateStr = d.toISOString().split('T')[0];
        const displayStr = d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        dates.push({ date: dateStr, display: displayStr });
      }
    }

    return dates;
  }, []);

  const handleDateSelect = (date: string) => {
    onSelect(date, localSelectedTime);
  };

  const handleTimeSelect = (time: 'morning' | 'afternoon' | 'no-preference') => {
    setLocalSelectedTime(time);
    if (selectedDate) {
      onSelect(selectedDate, time);
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Grid */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Installation Date
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {availableDates.map(({ date, display }) => (
            <button
              key={date}
              onClick={() => handleDateSelect(date)}
              className={`px-2 py-2 rounded text-center text-xs sm:text-sm font-medium transition-all ${
                selectedDate === date
                  ? 'bg-fiber-red text-white border-2 border-fiber-red shadow-md'
                  : 'bg-muted text-foreground border-2 border-border hover:border-fiber-red/30 hover:bg-fiber-red/5'
              }`}
            >
              {display}
            </button>
          ))}
        </div>
      </div>

      {/* Time Preference */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Time Preference
        </label>
        <div className="flex flex-wrap gap-3">
          {(['morning', 'afternoon', 'no-preference'] as const).map((time) => (
            <label
              key={time}
              className="flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="time-preference"
                value={time}
                checked={localSelectedTime === time}
                onChange={() => handleTimeSelect(time)}
                className="w-4 h-4 text-fiber-red border-border focus:ring-2 focus:ring-fiber-red"
              />
              <span className="ml-2 text-sm text-foreground capitalize">
                {time === 'no-preference' ? 'No Preference' : time}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

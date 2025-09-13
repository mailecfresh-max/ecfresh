import { format, addDays, parse, isAfter, addHours } from 'date-fns';

export const TIME_SLOTS = {
  MORNING: '10:00-14:00',
  EVENING: '16:00-20:00'
} as const;

export const PREP_HOURS = 20;

export type TimeSlot = typeof TIME_SLOTS[keyof typeof TIME_SLOTS];

export interface AvailableSlot {
  date: string;
  timeSlot: TimeSlot;
  available: boolean;
}

export const getAvailableTimeSlots = (): AvailableSlot[] => {
  const now = new Date();
  const slots: AvailableSlot[] = [];
  
  // Get next 3 days (excluding today)
  for (let i = 1; i <= 3; i++) {
    const date = addDays(now, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Morning slot
    const morningStart = parse(`${dateStr} 10:00`, 'yyyy-MM-dd HH:mm', new Date());
    const morningAvailable = isAfter(morningStart, addHours(now, PREP_HOURS));
    
    // Additional rule: if current time >= 14:00, disable next day morning slot
    const morningDisabledByRule = i === 1 && now.getHours() >= 14;
    
    slots.push({
      date: dateStr,
      timeSlot: TIME_SLOTS.MORNING,
      available: morningAvailable && !morningDisabledByRule
    });
    
    // Evening slot
    const eveningStart = parse(`${dateStr} 16:00`, 'yyyy-MM-dd HH:mm', new Date());
    const eveningAvailable = isAfter(eveningStart, addHours(now, PREP_HOURS));
    
    slots.push({
      date: dateStr,
      timeSlot: TIME_SLOTS.EVENING,
      available: eveningAvailable
    });
  }
  
  return slots;
};

export const formatTimeSlot = (slot: TimeSlot): string => {
  switch (slot) {
    case TIME_SLOTS.MORNING:
      return '10:00 AM - 2:00 PM';
    case TIME_SLOTS.EVENING:
      return '4:00 PM - 8:00 PM';
    default:
      return slot;
  }
};
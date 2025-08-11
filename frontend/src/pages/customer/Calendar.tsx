import React from 'react';
import { mockCalendarEvents } from '../../data/customerData';
import CalendarView from '../../components/customer/CalendarView';
import { CalendarEvent } from '../../types/customer';

const Calendar: React.FC = () => {
  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event);
    // Handle event click (e.g., show event details modal)
  };

  return (
    <div className="space-y-6">
      <CalendarView 
        events={mockCalendarEvents}
        onEventClick={handleEventClick}
      />
    </div>
  );
};

export default Calendar;
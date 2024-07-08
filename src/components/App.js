import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Popup from 'react-popup';

const localizer = momentLocalizer(moment);

const EventTracker = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Initialize events array with some sample data
    setEvents([
      { title: 'Event 1', start: new Date('2022-01-01'), end: new Date('2022-01-01') },
      { title: 'Event 2', start: new Date('2022-01-05'), end: new Date('2022-01-05') },
      { title: 'Event 3', start: new Date('2022-01-10'), end: new Date('2022-01-10') },
    ]);
  }, []);

  const handleSelect = (date) => {
    setSelectedDate(date);
    const existingEvent = events.find((event) => moment(event.start).isSame(date, 'day'));
    if (existingEvent) {
      setShowEditEvent(true);
      setSelectedEvent(existingEvent);
    } else {
      setShowCreateEvent(true);
    }
  };

  const handleCreateEvent = (title, start, end) => {
    const newEvent = { title, start, end };
    setEvents([...events, newEvent]);
    setShowCreateEvent(false);
  };

  const handleEditEvent = (title, start, end) => {
    const updatedEvent = { ...selectedEvent, title, start, end };
    setEvents(events.map((event) => (event === selectedEvent ? updatedEvent : event)));
    setShowEditEvent(false);
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter((event) => event !== selectedEvent));
    setShowEditEvent(false);
  };

  const handleFilter = (filterType) => {
    switch (filterType) {
      case 'all':
        setEvents(events);
        break;
      case 'past':
        setEvents(events.filter((event) => moment(event.start).isBefore(new Date())));
        break;
      case 'upcoming':
        setEvents(events.filter((event) => moment(event.start).isAfter(new Date())));
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        onSelectEvent={(event) => console.log(event)}
        onSelectSlot={(date) => handleSelect(date)}
        defaultView="month"
        views={['month', 'week', 'day']}
      />
      <button onClick={() => handleFilter('all')}>All</button>
      <button onClick={() => handleFilter('past')}>Past</button>
      <button onClick={() => handleFilter('upcoming')}>Upcoming</button>
      {showCreateEvent && (
        <Popup
          title="Create Event"
          onClose={() => setShowCreateEvent(false)}
        >
          <form>
            <label>
              Title:
              <input type="text" />
            </label>
            <label>
              Start:
              <input type="datetime-local" />
            </label>
            <label>
              End:
              <input type="datetime-local" />
            </label>
            <button onClick={(title, start, end) => handleCreateEvent(title, start, end)}>Create</button>
          </form>
        </Popup>
      )}
      {showEditEvent && (
        <Popup
          title="Edit Event"
          onClose={() => setShowEditEvent(false)}
        >
          <form>
            <label>
              Title:
              <input type="text" value={selectedEvent.title} />
            </label>
            <label>
              Start:
              <input type="datetime-local" value={selectedEvent.start} />
            </label>
            <label>
              End:
              <input type="datetime-local" value={selectedEvent.end} />
            </label>
            <button onClick={(title, start, end) => handleEditEvent(title, start, end)}>Edit</button>
            <button onClick={handleDeleteEvent}>Delete</button>
          </form>
        </Popup>
      )}
    </div>
  );
};

export default EventTracker;
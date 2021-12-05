import '../../App.css'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker';
import { useState } from 'react';


function Calendar2() {

    // const [selectedDate, setSelectedDate] = useState(new Date())
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const onChange = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };
    // let handleCalendarOpen = () => alert("Calendar is opened")
    // let handleCalendarClosed = () => alert("Calendar is closed")

    return (
        <div>
            <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                dateFormat='dd/MM/yyyy'
                isClearable
                withPortal
                placeholderText='Wybierz date'
                todayButton='Dzisiaj'
                // fixedHeight

            // inline
            // showYearDropdown
            // showMonthDropdown
            />
        <div>Selected start date={startDate ? startDate.toString() : null}</div>
        <div>Selected end date={endDate ? endDate.toString() : null}</div>
        </div>
        
    );
}

export default Calendar2;
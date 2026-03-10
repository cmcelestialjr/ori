import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaTimes, FaEdit, FaToggleOn, FaToggleOff, FaCheck } from 'react-icons/fa';
import InputDate from './components/ui/InputDate';
import { useToast } from './hooks/useToast';

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(newDate);
    onClose();
  };
  
  const renderCalendarDays = () => {
    const days = [];
    const daysCount = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDay = firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    
    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    // Actual days of the month
    for (let day = 1; day <= daysCount; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      console.log(date)
      const isSelected = 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth.getMonth() && 
        selectedDate.getFullYear() === currentMonth.getFullYear();
      
      days.push(
        <div 
          key={day} 
          onClick={() => handleDateClick(day)}
          className={`flex items-center justify-center h-8 w-8 rounded-full cursor-pointer transition-colors
            ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
        >
          {day}
        </div>
      );
    }
    return days;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          &lt;
        </button>
        <div className="font-medium">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <button 
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs text-center font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

interface ResearchSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    isActive: boolean;
    startDate: Date;
    endDate: Date;
  };
}

const ResearchSubmissionModal: React.FC<ResearchSubmissionModalProps> = ({ isOpen, onClose, initialData }) => {
  const [isActive, setIsActive] = useState<boolean>(initialData?.isActive || true);
  const [startDate, setStartDate] = useState<Date>(initialData?.startDate || new Date());
  const [endDate, setEndDate] = useState<Date>(initialData?.endDate || new Date());
  const [duration, setDuration] = useState<number>(0);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  
  useEffect(() => {
    // Calculate duration when dates change
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    setDuration(diffDays);
  }, [startDate, endDate]);
  
  const formatDate = (date: Date): string => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  const formatDateRange = (): string => {
    const startMonth = startDate.toLocaleString('default', { month: 'short' });
    const endMonth = endDate.toLocaleString('default', { month: 'short' });
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    
    if (startDate.getFullYear() === endDate.getFullYear()) {
      if (startDate.getMonth() === endDate.getMonth()) {
        return `${startMonth} ${startDay} - ${endDay}`;
      }
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
    return `${startMonth} ${startDay}, ${startDate.getFullYear()} - ${endMonth} ${endDay}, ${endDate.getFullYear()}`;
  };
  
  const handleSave = () => {
    // Here you would typically send data to your backend
    // For demo purposes, we'll just log it
    console.log({
      isActive,
      startDate,
      endDate,
      duration
    });
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-medium">Research Submission Period Management</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="mr-3">Status:</span>
              <button
                onClick={() => setIsActive(!isActive)}
                className="focus:outline-none"
              >
                {isActive ? (
                  <div className="flex items-center text-green-600">
                    <FaToggleOn size={24} className="mr-2" />
                    <span>Active</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-500">
                    <FaToggleOff size={24} className="mr-2" />
                    <span>Inactive</span>
                  </div>
                )}
              </button>
            </div>
            <button 
              className="text-blue-600 hover:text-blue-800"
            >
              <FaEdit />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div 
                className="flex items-center justify-between border rounded-md p-3 cursor-pointer hover:border-blue-500"
                onClick={() => setShowStartDatePicker(!showStartDatePicker)}
              >
                <span>{formatDate(startDate)}</span>
                <FaCalendarAlt className="text-gray-400" />
              </div>
              {showStartDatePicker && (
                <div className="absolute z-10 mt-1">
                  <DatePicker 
                    selectedDate={startDate} 
                    onChange={setStartDate} 
                    onClose={() => setShowStartDatePicker(false)}
                  />
                </div>
              )}
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div 
                className="flex items-center justify-between border rounded-md p-3 cursor-pointer hover:border-blue-500"
                onClick={() => setShowEndDatePicker(!showEndDatePicker)}
              >
                <span>{formatDate(endDate)}</span>
                <FaCalendarAlt className="text-gray-400" />
              </div>
              {showEndDatePicker && (
                <div className="absolute z-10 mt-1">
                  <DatePicker 
                    selectedDate={endDate} 
                    onChange={setEndDate} 
                    onClose={() => setShowEndDatePicker(false)}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <div className="flex flex-col border rounded-md p-3">
              <span className="text-lg font-medium">{duration} days</span>
              <span className="text-sm text-gray-500">{formatDateRange()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 mr-2 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaCheck className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// Example usage in your main application component
const Test: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dateRef = useRef<HTMLInputElement | null>(null);

  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };

  const handleError = () => {
    toast.error('Something went wrong!');
  };

  const handleInfo = () => {
    toast.info('Here is some information for you.');
  };

  const handleWarning = () => {
    toast.warning('Be careful with this action!');
  };

  const handleUpdateToast = () => {
    const toastId = toast.info('Loading...');
    
    // Simulate an API call
    setTimeout(() => {
      toast.update(toastId, 'Data loaded successfully!', {
        type: 'success',
        autoClose: 5000
      });
    }, 2000);
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }  

  const onChange = () => {
    if (dateRef.current?.value) {
      const formattedDate = formatDate(dateRef.current.value)
      console.log(formattedDate)
    }
  }
  
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Research Submission Period Management</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Active
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
            <p className="mt-1">March 17, 2025</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">End Date</h3>
            <p className="mt-1">April 30, 2025</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Duration</h3>
            <p className="mt-1">44 days</p>
            <p className="text-xs text-gray-500">March 17 - April 30</p>
          </div>
        </div>
      </div>
      
      <ResearchSubmissionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{
          isActive: true,
          startDate: new Date(2025, 2, 17), // March 17, 2025
          endDate: new Date(2025, 3, 30),   // April 30, 2025
        }}
      />

      <input onChange={onChange} ref={dateRef} type="date" className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

      <InputDate />



      <div>
      <h1>Toast Example</h1>
      <div className='flex gap-2 flex-col'>
        <button className='border border-x-gray-500' onClick={handleSuccess}>Show Success Toast</button>
        <button className='border border-x-gray-500' onClick={handleError}>Show Error Toast</button>
        <button className='border border-x-gray-500' onClick={handleInfo}>Show Info Toast</button>
        <button className='border border-x-gray-500' onClick={handleWarning}>Show Warning Toast</button>
        <button className='border border-x-gray-500' onClick={handleUpdateToast}>Show Updating Toast</button>
      </div>
    </div>

    </div>
  );
};

export default Test;
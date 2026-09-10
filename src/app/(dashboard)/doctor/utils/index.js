// Date formatting utilities
export const formatDateForInput = (date) => {
  if (!date) return '';
  return date.split('T')[0]; // YYYY-MM-DD
};

export const formatDateForDisplay = (date) => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const formatTimeForDisplay = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Validation utilities
export const validateScheduleForm = (formData) => {
  const errors = {};
  
  if (!formData.location) {
    errors.location = 'Location is required';
  }
  
  if (!formData.startTime) {
    errors.startTime = 'Start time is required';
  }
  
  if (!formData.endTime) {
    errors.endTime = 'End time is required';
  }
  
  if (!formData.slotDuration) {
    errors.slotDuration = 'Slot duration is required';
  }
  
  if (formData.startTime && formData.endTime) {
    const start = new Date(`2000-01-01T${formData.startTime}`);
    const end = new Date(`2000-01-01T${formData.endTime}`);
    if (end <= start) {
      errors.endTime = 'End time must be after start time';
    }
  }
  
  if (formData.activeDays && formData.activeDays.length === 0) {
    errors.activeDays = 'At least one day must be selected';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Time utilities
export const generateTimeSlots = (startTime, endTime, slotDuration, breakDuration = 0) => {
  const slots = [];
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const slotDurationMs = slotDuration * 60 * 1000; // Convert minutes to milliseconds
  const breakDurationMs = breakDuration * 60 * 1000; // Convert minutes to milliseconds
  
  let currentTime = start;
  let slotNumber = 1;
  
  while (currentTime < end) {
    const slotEndTime = new Date(currentTime.getTime() + slotDurationMs);
    
    if (slotEndTime <= end) {
      slots.push({
        id: slotNumber,
        startTime: currentTime.toTimeString().slice(0, 5),
        endTime: slotEndTime.toTimeString().slice(0, 5),
        available: true,
      });
    }
    
    currentTime = new Date(slotEndTime.getTime() + breakDurationMs);
    slotNumber++;
  }
  
  return slots;
};

// Array utilities
export const reorderArray = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Local storage utilities
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Error handling utilities
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || 'Server error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};

// Notification utilities
export const showNotification = (message, type = 'info') => {
  // This can be integrated with a notification library like react-toastify
  console.log(`${type.toUpperCase()}: ${message}`);
  
  // For now, using browser alerts as fallback
  if (type === 'error') {
    alert(`Error: ${message}`);
  } else if (type === 'success') {
    alert(`Success: ${message}`);
  }
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHospitals,
  fetchSchedules,
  selectHospitals,
  selectSchedules,
  selectLoading,
  selectError,
} from '../store/scheduleSlice';

// Custom hook for hospitals data
export const useHospitals = () => {
  const dispatch = useDispatch();
  const hospitals = useSelector(selectHospitals);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    if (hospitals.length === 0) {
      dispatch(fetchHospitals());
    }
  }, [dispatch, hospitals.length]);

  return { hospitals, loading, error };
};

// Custom hook for schedules data
export const useSchedules = () => {
  const dispatch = useDispatch();
  const schedules = useSelector(selectSchedules);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

  return { schedules, loading, error, refetch: () => dispatch(fetchSchedules()) };
};

// Custom hook for form data management
export const useScheduleForm = (initialData = {}) => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.schedule.formData);
  const editIndex = useSelector((state) => state.schedule.editIndex);

  const updateFormData = (data) => {
    dispatch({ type: 'schedule/setFormData', payload: data });
  };

  const resetForm = () => {
    dispatch({ type: 'schedule/resetFormData' });
  };

  const setEditIndex = (index) => {
    dispatch({ type: 'schedule/setEditIndex', payload: index });
  };

  return {
    formData,
    editIndex,
    updateFormData,
    resetForm,
    setEditIndex,
  };
};

// Custom hook for notifications
export const useNotification = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.schedule.error);
  const successMessage = useSelector((state) => state.schedule.successMessage);

  const clearError = () => {
    dispatch({ type: 'schedule/clearError' });
  };

  const clearSuccessMessage = () => {
    dispatch({ type: 'schedule/clearSuccessMessage' });
  };

  return {
    error,
    successMessage,
    clearError,
    clearSuccessMessage,
  };
};

// Custom hook for API operations
export const useScheduleActions = () => {
  const dispatch = useDispatch();

  const createSchedule = (scheduleData) => {
    return dispatch({ type: 'schedule/createSchedule', payload: scheduleData });
  };

  const updateSchedule = (id, scheduleData) => {
    return dispatch({ type: 'schedule/updateSchedule', payload: { id, scheduleData } });
  };

  const deleteSchedule = (id) => {
    return dispatch({ type: 'schedule/deleteSchedule', payload: id });
  };

  return {
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
};

// Custom hook for local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Custom hook for debounced values
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

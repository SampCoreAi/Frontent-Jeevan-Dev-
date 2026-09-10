import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleService } from '../services/api';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';

// Async thunks for schedule operations
export const fetchHospitals = createAsyncThunk(
  "schedule/fetchHospitals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await scheduleService.getHospitals();

      return {
        hospitals: response.data || [],
        availability: response.availability || [],
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchSchedules = createAsyncThunk(
  'schedule/fetchSchedules',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scheduleService.getSchedules();
      const schedules = response.data || [];

      return schedules.map((item) => {
        let hospitalParsed = {};

        try {
          hospitalParsed = JSON.parse(item.hospitalName || "{}");
        } catch (e) {}

        return {
          id: item.scheduleId,
doctorId: item.doctorId,
          // hospital
          location: item.hospitalName,
          hospitalInfo: hospitalParsed,

          // timing
          startTime: item.timing?.start,
          endTime: item.timing?.end,
          slotDuration: item.timing?.slotDuration,
          breakDuration: item.timing?.breakMinutes,
          // availability
          booking_length: item.booking_length,
          activeDays: item.availability?.activeDays || [],
          startDate: item.availability?.startDate,
          endDate: item.availability?.endDate,

        };
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createSchedule = createAsyncThunk(
  'schedule/createSchedule',
  async (scheduleData, { rejectWithValue }) => {
    try {
      // Validate required fields
      if (!scheduleData.location || !scheduleData.startTime || 
          !scheduleData.endTime || !scheduleData.slotDuration) {
        throw new Error('Please fill all required fields: Location, Start Time, End Time, and Slot Duration');
      }

      const payload = {
  location_id: null,
 hospital_name: scheduleData.location,

  start_time: scheduleData.startTime,
  end_time: scheduleData.endTime,
  slot_duration: Number(scheduleData.slotDuration),
  break_minutes: Number(scheduleData.breakDuration) || 0,


  active_days: scheduleData.activeDays
    .filter(Boolean)
    .map((day) => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()),

  start_date: scheduleData.startDate,
  end_date: scheduleData.endDate,
  note: scheduleData.note || null,
};

      console.log('Sending schedule creation payload:', payload);

      const response = await scheduleService.createSchedule(payload);
      console.log('Schedule creation response:', response);
      console.log('Schedule ID:', response.data?.scheduleId);
      console.log('Total slots created:', response.data?.totalSlots);
      
      return {
        ...scheduleData,
        id: response.data?.scheduleId || response.data?.id,
      };
   } catch (error) {
  console.log("CREATE SCHEDULE ERROR:", error);

  const apiError = error?.response?.data;

  if (apiError?.errors?.length > 0) {
    return rejectWithValue(apiError.errors[0]);
  }

  return rejectWithValue(
    apiError?.message ||
    error?.message ||
    "Failed to create schedule"
  );
}
  }
);
export const updateSlotStatus = createAsyncThunk(
  "schedule/updateSlotStatus",
  async (
    {
      scheduleId,
      slotId,
      status,
    },
    { rejectWithValue }
  ) => {
    try {
      const response =
        await scheduleService.updateSlotStatus(
          scheduleId,
          slotId,
          status
        );

      return {
        scheduleId,
        slotId,
        status,
        message:
          response.message ||
          "Slot status updated successfully.",
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateSchedule = createAsyncThunk(
  'schedule/updateSchedule',
  async ({ id, scheduleData }, { rejectWithValue }) => {
    try {
      const payload = {
        location_id: null,
      hospital_name: scheduleData.location,
        start_time: scheduleData.startTime,
        end_time: scheduleData.endTime,
        slot_duration: scheduleData.slotDuration,
        break_minutes: scheduleData.breakDuration,
          
        active_days: scheduleData.activeDays
        
          .filter(Boolean)
          .map((day) => day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()),
        start_date: scheduleData.startDate,
        end_date: scheduleData.endDate,
        note: scheduleData.note || null,
      };

      await scheduleService.updateSchedule(id, payload);
      return { ...scheduleData, id };
   } catch (error) {
  console.log("UPDATE SCHEDULE ERROR:", error);

  const apiError = error?.response?.data;

  if (apiError?.errors?.length > 0) {
    return rejectWithValue(apiError.errors[0]);
  }

  return rejectWithValue(
    apiError?.message ||
    error?.message ||
    "Failed to update schedule"
  );
}
  }
);

export const deleteSchedule = createAsyncThunk(
  "schedule/deleteSchedule",
  async (
    {
      scheduleId,
      type,
      slotId = null,
      date = null,
      reason = null,
    },
    { rejectWithValue }
  ) => {
    try {
      let body = null;

      if (type === "slot") {
        body = {
          slotId,
          reason,
        };
      }

      if (type === "date") {
        body = {
          date,
          reason,
        };
      }

      // Full schedule delete + booking exist
      if (type === "schedule" && reason) {
        body = {
          reason,
        };
      }

      const response =
        await scheduleService.deleteSchedule(
          scheduleId,
          body
        );

      return {
        scheduleId,
        type,
        slotId,
        date,
        message: response.message,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  schedules: [],
  hospitals: [],
    availability: [],
  loading: false,
  error: null,
  successMessage: null,
  formData: {
    location: '',
    startTime: '',
    endTime: '',
    slotDuration: '',
    breakDuration: '',
    startDate: '',
    endDate: '',
    activeDays: [],
    note: '',
    address: null,
  },
  editIndex: null,
};

// Slice definition
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFormData: (state) => {
      state.formData = initialState.formData;
      state.editIndex = null;
    },
    setEditIndex: (state, action) => {
      state.editIndex = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
   setEditFormData: (state, action) => {
  const schedule = action.payload;

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
  };

  state.formData = {
    ...schedule,
    startDate: formatDate(schedule.startDate),
    endDate: formatDate(schedule.endDate),
  };
},
  },
  extraReducers: (builder) => {
    builder
      // Fetch hospitals
      .addCase(fetchHospitals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
  state.loading = false;
  state.hospitals = action.payload.hospitals;
  state.availability = action.payload.availability;
})
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch schedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create schedule
      .addCase(createSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules.push(action.payload);
        state.successMessage = SUCCESS_MESSAGES.SCHEDULE_CREATED;
        state.formData = initialState.formData;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update schedule
      .addCase(updateSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.schedules.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.schedules[index] = action.payload;
        }
        state.successMessage = SUCCESS_MESSAGES.SCHEDULE_UPDATED;
        state.editIndex = null;
        state.formData = initialState.formData;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete schedule
      .addCase(deleteSchedule.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(deleteSchedule.fulfilled, (state, action) => {
  state.loading = false;

  if (action.payload.type === "schedule") {
    state.schedules = state.schedules.filter(
      (schedule) =>
        schedule.id !== action.payload.scheduleId
    );
  }

  state.successMessage = action.payload.message;
})
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setFormData,
  resetFormData,
  setEditIndex,
  clearError,
  clearSuccessMessage,
  setEditFormData,
} = scheduleSlice.actions;

export const selectSchedules = (state) => state.schedule.schedules;
export const selectHospitals = (state) => state.schedule.hospitals;
export const selectAvailability = (state) => state.schedule.availability;
export const selectLoading = (state) => state.schedule.loading;
export const selectError = (state) => state.schedule.error;
export const selectSuccessMessage = (state) => state.schedule.successMessage;
export const selectFormData = (state) => state.schedule.formData;
export const selectEditIndex = (state) => state.schedule.editIndex;

export default scheduleSlice.reducer;

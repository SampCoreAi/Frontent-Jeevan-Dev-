import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { scheduleService } from "../services/api";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../constants";

// ============================================================
// FETCH HOSPITALS
// ============================================================

export const fetchHospitals = createAsyncThunk(
  "schedule/fetchHospitals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await scheduleService.getHospitals();

      return {
        hospitals: response?.data || [],
        availability: response?.availability || [],
      };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch hospitals"
      );
    }
  }
);

// ============================================================
// FETCH SCHEDULES
// ============================================================

export const fetchSchedules = createAsyncThunk(
  "schedule/fetchSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const response = await scheduleService.getSchedules();

      console.log("GET SCHEDULE RESPONSE:", response);

      const schedules = Array.isArray(response?.data)
        ? response.data
        : [];

      const mappedSchedules = schedules.map((item, index) => {
        if (!item || typeof item !== "object") {
          return null;
        }

        // =====================================================
        // ID
        // =====================================================

        const id =
          item?.scheduleId ??
          item?.schedule_id ??
          item?.id ??
          `schedule-${index}`;

        // =====================================================
        // CLINIC ID
        // =====================================================

        const clinicId =
          item?.clinic_id ??
          item?.clinicId ??
          item?.location_id ??
          null;

        // =====================================================
        // HOSPITAL NAME
        // =====================================================

        const hospitalName =
          item?.hospital_name ??
          item?.hospitalName ??
          item?.location ??
          "";

        // =====================================================
        // TIMING
        // =====================================================

        const timing =
          item?.timing &&
          typeof item.timing === "object"
            ? item.timing
            : {};

        // =====================================================
        // AVAILABILITY
        // =====================================================

        const availability =
          item?.availability &&
          typeof item.availability === "object"
            ? item.availability
            : {};

        // =====================================================
        // ACTIVE DAYS
        // =====================================================

        const activeDays = Array.isArray(
          availability?.activeDays
        )
          ? availability.activeDays
          : Array.isArray(item?.active_days)
            ? item.active_days
            : Array.isArray(item?.activeDays)
              ? item.activeDays
              : [];

        // =====================================================
        // HOSPITAL INFO
        // =====================================================

        let hospitalInfo = null;

        if (
          item?.hospitalInfo &&
          typeof item.hospitalInfo === "object"
        ) {
          hospitalInfo = item.hospitalInfo;
        } else if (
          item?.hospital_info &&
          typeof item.hospital_info === "object"
        ) {
          hospitalInfo = item.hospital_info;
        } else {
          hospitalInfo = {
            hospitalName,
          };
        }

        // =====================================================
        // DATES
        // =====================================================

        const startDate =
          availability?.startDate ??
          item?.start_date ??
          "";

        const endDate =
          availability?.endDate ??
          item?.end_date ??
          "";

        // =====================================================
        // RETURN FRONTEND FORMAT
        // =====================================================

        return {
          // IDs
          id,
          scheduleId: id,

          doctorId:
            item?.doctorId ??
            item?.doctor_id ??
            null,

          clinicId,

          // Hospital
          location: hospitalName,
          hospital_name: hospitalName,
          hospitalInfo,

          // Timing
          startTime:
            item?.start_time ??
            timing?.start ??
            "",

          endTime:
            item?.end_time ??
            timing?.end ??
            "",

          // Duration
          slotDuration:
            item?.slot_duration ??
            timing?.slotDuration ??
            0,

          breakDuration:
            item?.break_minutes ??
            timing?.breakMinutes ??
            0,

          booking_length:
            item?.booking_length ??
            0,

          // Days
          activeDays,

          // Dates
          startDate,
          endDate,

          // Note
          note: item?.note ?? "",

          // Address
          address: item?.address ?? null,

          // IMPORTANT:
          // Agar SavedSchedules `type` use karta hai,
          // to undefined nahi milega.
          type: item?.type ?? "schedule",
        };
      });

      const validSchedules =
        mappedSchedules.filter(Boolean);

      console.log(
        "MAPPED SCHEDULES:",
        validSchedules
      );

      return validSchedules;
    } catch (error) {
      console.error(
        "FETCH SCHEDULES ERROR:",
        error
      );

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch schedules"
      );
    }
  }
);


// ============================================================
// CREATE SCHEDULE
// ============================================================

export const createSchedule = createAsyncThunk(
  "schedule/createSchedule",
  async (scheduleData, { rejectWithValue }) => {
    try {
      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

      if (
        !scheduleData?.location ||
        !scheduleData?.slotDuration
      ) {
        throw new Error(
          "Please fill all required fields: Location, Start Time, End Time, and Slot Duration"
        );
      }

     
   const payload = {
  clinic_id: scheduleData.clinicId,

  hospital_name: scheduleData.location,

  start_time: scheduleData.startTime || null,

  end_time: scheduleData.endTime || null,

  slot_duration: Number(
    scheduleData.slotDuration
  ),

  break_minutes:
    Number(scheduleData.breakDuration) || 0,

  active_days: Array.isArray(scheduleData.activeDays)
    ? scheduleData.activeDays
        .filter(Boolean)
        .map(
          (day) =>
            day.charAt(0).toUpperCase() +
            day.slice(1).toLowerCase()
        )
    : [],

  start_date: scheduleData.startDate,

  end_date: scheduleData.endDate,

  note: scheduleData.note || null,
};


      console.log(
        "SENDING CREATE SCHEDULE PAYLOAD:",
        payload
      );

      const response =
        await scheduleService.createSchedule(
          payload
        );

      console.log(
        "CREATE SCHEDULE RESPONSE:",
        response
      );

      // ------------------------------------------------------
      // RETURN LOCAL SCHEDULE
      // ------------------------------------------------------

      return {
        ...scheduleData,

        id:
          response?.data?.scheduleId ??
          response?.data?.schedule_id ??
          response?.data?.id,

        scheduleId:
          response?.data?.scheduleId ??
          response?.data?.schedule_id ??
          response?.data?.id,

        clinicId:
          scheduleData.clinicId,
      };
    } catch (error) {
      console.log(
        "CREATE SCHEDULE ERROR:",
        error
      );

      const apiError =
        error?.response?.data;

      if (
        apiError?.errors?.length > 0
      ) {
        return rejectWithValue(
          apiError.errors[0]
        );
      }

      return rejectWithValue(
        apiError?.message ||
          error?.message ||
          "Failed to create schedule"
      );
    }
  }
);

// ============================================================
// UPDATE SLOT STATUS
// ============================================================

export const updateSlotStatus =
  createAsyncThunk(
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
            response?.message ||
            "Slot status updated successfully.",
        };
      } catch (error) {
        return rejectWithValue(
          error?.message ||
            "Failed to update slot status"
        );
      }
    }
  );

// ============================================================
// UPDATE SCHEDULE
// ============================================================

export const updateSchedule = createAsyncThunk(
  "schedule/updateSchedule",
  async (
    { id, scheduleData },
    { rejectWithValue }
  ) => {
    try {
      console.log(
        "UPDATE SCHEDULE DATA:",
        scheduleData
      );

      // ------------------------------------------------------
      // CLINIC ID
      // ------------------------------------------------------

      const clinicId =
        scheduleData?.clinicId ??
        scheduleData?.clinic_id ??
        scheduleData?.location_id ??
        null;

   
      // ------------------------------------------------------
      // PAYLOAD
      // ------------------------------------------------------

      const payload = {
        clinic_id: clinicId,

        hospital_name:
          scheduleData.location,

        start_time:
          scheduleData.startTime ||
          null,

        end_time:
          scheduleData.endTime ||
          null,

        slot_duration:
          Number(
            scheduleData.slotDuration
          ),

        break_minutes:
          Number(
            scheduleData.breakDuration
          ) || 0,

        active_days:
          Array.isArray(
            scheduleData.activeDays
          )
            ? scheduleData.activeDays
                .filter(Boolean)
                .map(
                  (day) =>
                    day.charAt(0).toUpperCase() +
                    day.slice(1).toLowerCase()
                )
            : [],

        start_date:
          scheduleData.startDate,

        end_date:
          scheduleData.endDate,

        note:
          scheduleData.note || null,
      };

      console.log(
        "UPDATE SCHEDULE PAYLOAD:",
        payload
      );

      await scheduleService.updateSchedule(
        id,
        payload
      );

      // ------------------------------------------------------
      // RETURN
      // ------------------------------------------------------

      return {
        ...scheduleData,

        id,

        scheduleId: id,

        clinicId,
      };
    } catch (error) {
      console.log(
        "UPDATE SCHEDULE ERROR:",
        error
      );

      const apiError =
        error?.response?.data;

      if (
        apiError?.errors?.length > 0
      ) {
        return rejectWithValue(
          apiError.errors[0]
        );
      }

      return rejectWithValue(
        apiError?.message ||
          error?.message ||
          "Failed to update schedule"
      );
    }
  }
);

// ============================================================
// DELETE SCHEDULE
// ============================================================

export const deleteSchedule =
  createAsyncThunk(
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

        // Slot
        if (type === "slot") {
          body = {
            slotId,
            reason,
          };
        }

        // Date
        if (type === "date") {
          body = {
            date,
            reason,
          };
        }

        // Schedule with booking
        if (
          type === "schedule" &&
          reason
        ) {
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

          message:
            response?.message ||
            "Schedule deleted successfully.",
        };
      } catch (error) {
        return rejectWithValue(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to delete schedule"
        );
      }
    }
  );

// ============================================================
// INITIAL STATE
// ============================================================

const initialState = {
  schedules: [],

  hospitals: [],

  availability: [],

  loading: false,

  error: null,

  successMessage: null,

  formData: {
    location: "",

    clinicId: null,

    startTime: "",

    endTime: "",

    slotDuration: "",

    breakDuration: "",

    startDate: "",

    endDate: "",

    activeDays: [],

    note: "",

    address: null,
  },

  editIndex: null,
};

// ============================================================
// SLICE
// ============================================================

const scheduleSlice =
  createSlice({
    name: "schedule",

    initialState,

    reducers: {
      // ------------------------------------------------------
      // SET FORM DATA
      // ------------------------------------------------------

      setFormData: (
        state,
        action
      ) => {
        state.formData = {
          ...state.formData,
          ...action.payload,
        };
      },

      // ------------------------------------------------------
      // RESET FORM
      // ------------------------------------------------------

      resetFormData: (
        state
      ) => {
        state.formData = {
          ...initialState.formData,
        };

        state.editIndex = null;
      },

      // ------------------------------------------------------
      // EDIT INDEX
      // ------------------------------------------------------

      setEditIndex: (
        state,
        action
      ) => {
        state.editIndex =
          action.payload;
      },

      // ------------------------------------------------------
      // CLEAR ERROR
      // ------------------------------------------------------

      clearError: (
        state
      ) => {
        state.error = null;
      },

      // ------------------------------------------------------
      // CLEAR SUCCESS
      // ------------------------------------------------------

      clearSuccessMessage: (
        state
      ) => {
        state.successMessage =
          null;
      },

      // ------------------------------------------------------
      // SET EDIT FORM DATA
      // ------------------------------------------------------

      setEditFormData: (
        state,
        action
      ) => {
        const schedule =
          action.payload;

        const formatDate = (
          date
        ) => {
          if (!date) {
            return "";
          }

          return new Date(
            date
          ).toLocaleDateString(
            "en-CA",
            {
              timeZone:
                "Asia/Kolkata",
            }
          );
        };

        // ----------------------------------------------------
        // CLINIC ID PRESERVE
        // ----------------------------------------------------

        const clinicId =
          schedule?.clinicId ??
          schedule?.clinic_id ??
          schedule?.location_id ??
          null;

        state.formData = {
          ...state.formData,

          ...schedule,

          clinicId,

          location:
            schedule?.location ??
            schedule?.hospital_name ??
            "",

          startTime:
            schedule?.startTime ??
            "",

          endTime:
            schedule?.endTime ??
            "",

          slotDuration:
            schedule?.slotDuration ??
            "",

          breakDuration:
            schedule?.breakDuration ??
            "",

          activeDays:
            Array.isArray(
              schedule?.activeDays
            )
              ? schedule.activeDays
              : [],

          startDate:
            formatDate(
              schedule?.startDate
            ),

          endDate:
            formatDate(
              schedule?.endDate
            ),

          note:
            schedule?.note ??
            null,

          address:
            schedule?.address ??
            null,
        };

        console.log(
          "EDIT FORM DATA:",
          state.formData
        );
      },
    },

    // ========================================================
    // EXTRA REDUCERS
    // ========================================================

    extraReducers: (
      builder
    ) => {
      builder

        // ====================================================
        // FETCH HOSPITALS
        // ====================================================

        .addCase(
          fetchHospitals.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchHospitals.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.hospitals =
              action.payload
                ?.hospitals || [];

            state.availability =
              action.payload
                ?.availability || [];
          }
        )

        .addCase(
          fetchHospitals.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload;
          }
        )

        // ====================================================
        // FETCH SCHEDULES
        // ====================================================

        .addCase(
          fetchSchedules.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchSchedules.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.schedules =
              Array.isArray(
                action.payload
              )
                ? action.payload
                : [];

            console.log(
              "REDUX SCHEDULES:",
              state.schedules
            );
          }
        )

        .addCase(
          fetchSchedules.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload;

            state.schedules = [];

            console.log(
              "FETCH SCHEDULE REJECTED:",
              action.payload
            );
          }
        )

        // ====================================================
        // CREATE
        // ====================================================

        .addCase(
          createSchedule.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          createSchedule.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.schedules.push(
              action.payload
            );

            state.successMessage =
              SUCCESS_MESSAGES
                ?.SCHEDULE_CREATED ||
              "Schedule created successfully.";

            state.formData = {
              ...initialState.formData,
            };
          }
        )

        .addCase(
          createSchedule.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload;
          }
        )

        // ====================================================
        // UPDATE
        // ====================================================

        .addCase(
          updateSchedule.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          updateSchedule.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            const index =
              state.schedules.findIndex(
                (schedule) =>
                  schedule.id ===
                  action.payload.id
              );

            if (index !== -1) {
              state.schedules[index] =
                action.payload;
            }

            state.successMessage =
              SUCCESS_MESSAGES
                ?.SCHEDULE_UPDATED ||
              "Schedule updated successfully.";

            state.editIndex =
              null;

            state.formData = {
              ...initialState.formData,
            };
          }
        )

        .addCase(
          updateSchedule.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload;
          }
        )

        // ====================================================
        // DELETE
        // ====================================================

        .addCase(
          deleteSchedule.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          deleteSchedule.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            if (
              action.payload
                ?.type === "schedule"
            ) {
              state.schedules =
                state.schedules.filter(
                  (schedule) =>
                    schedule.id !==
                    action.payload
                      .scheduleId
                );
            }

            state.successMessage =
              action.payload
                ?.message;
          }
        )

        .addCase(
          deleteSchedule.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload;
          }
        );
    },
  });

// ============================================================
// EXPORT ACTIONS
// ============================================================

export const {
  setFormData,
  resetFormData,
  setEditIndex,
  clearError,
  clearSuccessMessage,
  setEditFormData,
} = scheduleSlice.actions;

// ============================================================
// SELECTORS
// ============================================================

export const selectSchedules = (
  state
) => state.schedule.schedules;

export const selectHospitals = (
  state
) => state.schedule.hospitals;

export const selectAvailability = (
  state
) => state.schedule.availability;

export const selectLoading = (
  state
) => state.schedule.loading;

export const selectError = (
  state
) => state.schedule.error;

export const selectSuccessMessage = (
  state
) => state.schedule.successMessage;

export const selectFormData = (
  state
) => state.schedule.formData;

export const selectEditIndex = (
  state
) => state.schedule.editIndex;

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default scheduleSlice.reducer;

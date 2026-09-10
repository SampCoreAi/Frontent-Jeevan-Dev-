import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { profileService } from '../services/api';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';
const S3_BUCKET_URL =
  process.env.NEXT_PUBLIC_S3_BUCKET_URL || "";
// Async thunks for profile operations
export const fetchDoctorProfile = createAsyncThunk(
  'profile/fetchDoctorProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileService.getProfile();

      return response.data || {};

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateDoctorProfile = createAsyncThunk(
  'profile/updateDoctorProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadLicense = createAsyncThunk(
  'profile/uploadLicense',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await profileService.uploadLicense(formData);
      const uploadedFile = response.data?.path || response.fileUrl || response.data;
      return uploadedFile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  'profile/uploadProfileImage',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await profileService.uploadImage(formData);
      const uploadedFile = response.data?.path || response.fileUrl || response.data;
      return uploadedFile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// LocalStorage se user data safely read karo
const getLocalUserData = () => {
  try {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
};

// Helper function to transform API data to form data
const transformApiDataToForm = (apiData, userData) => {
  const emptyWorkingHours = {
    monday: { start: '', end: '' },
    tuesday: { start: '', end: '' },
    wednesday: { start: '', end: '' },
    thursday: { start: '', end: '' },
    friday: { start: '', end: '' },
    saturday: { start: '', end: '' },
    sunday: { start: '', end: '' },
  };

  const emptyHospital = {
    hospitalName: '',
    flatNo: '',
    building: '',
    street: '',
    area: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    pinCode: '',
  };

  // Transform working hours
  const dayMap = {
    Monday: 'monday',
    Tuesday: 'tuesday',
    Wednesday: 'wednesday',
    Thursday: 'thursday',
    Friday: 'friday',
    Saturday: 'saturday',
    Sunday: 'sunday',
  };

  const workingHours = { ...emptyWorkingHours };
  apiData.availability?.forEach((item) => {
    const key = dayMap[item.day];
    if (key) {
      workingHours[key] = {
        start: item.startTime,
        end: item.endTime,
      };
    }
  });

  // Transform hospital details
 const hospitalsFromApi = (apiData.hospital_detail || []).map((h) => ({
  hospitalName: h.hospitalName || "",
  flatNo: h.flatPlotNo || "",
  building: h.buildingSociety || "",
  street: h.streetName || "",
  area: h.areaLocality || "",
  landmark: h.landmark || "",
  city: h.city || "",
  district: h.district || "",
  state: h.state || "",
  pinCode: h.pinCode || "",
}));
  // Ensure at least one hospital exists
  if (hospitalsFromApi.length === 0) {
    hospitalsFromApi.push({ ...emptyHospital });
  }

return {
  // Basic profile
  name: apiData.full_name || "",
  email: apiData.email || "",
    username: apiData.username || "",
  phone: apiData.mobile || "",
  mobile: apiData.mobile || "",

  // Professional details
  qualification: apiData.qualification || "",
  specialization: apiData.specialization || "",
  chipLabel: apiData.specialization || "",
  bio: apiData.bio || "",
registration_number: apiData.registration_number || "",
  language: Array.isArray(apiData.language)
    ? apiData.language
    : [],

  experience:
    apiData.experience !== null &&
    apiData.experience !== undefined
      ? apiData.experience.toString()
      : "",

  consultation_fee:
    apiData.consultation_fee !== null &&
    apiData.consultation_fee !== undefined
      ? apiData.consultation_fee.toString()
      : "",

  // Read-only medical details
  medical_registration_number:
    apiData.medical_registration_number || "",

  medical_council:
    apiData.medical_council || "",

  registration_expiry_date:
    apiData.registration_expiry_date || "",

  // Other read-only fields
  age: apiData.age || "",
  gender: apiData.gender || "",
  onboarding_status:
    apiData.onboarding_status || "",

  // Documents
  medical_registration_certificate:
    apiData.medical_registration_certificate || "",

  medical_degree_certificate:
    apiData.medical_degree_certificate || "",

  government_id_proof:
    apiData.government_id_proof || "",

  selfie:
    apiData.selfie || "",

  qr_url: apiData.qr_url || null,

  // Emergency patients
  accept_emergency_patients:
    apiData.accept_emergency_patients === "YES" ||
    apiData.accept_emergency_patients === 1 ||
    apiData.accept_emergency_patients === "1" ||
    apiData.accept_emergency_patients === true,

  // UI transformed data
  workingHours,
  hospitalDetail: hospitalsFromApi,

  rating: apiData.avgRating || 0,
 avatarUrl: apiData.img_key
  ? `${S3_BUCKET_URL}/${apiData.img_key}`
  : "",
};
};

const buildInitialState = () => {
  const u = getLocalUserData();
  return {
    profileData: {
      name: u.name || u.full_name || '',
      username: u.username || '@',
      qualification: '',
      bio: '',
      registration_number: '',
      language: [],
      experience: '',
      medicalLicense: '',
      email: u.email || '',
      qrCode: '',
      age: "",
      gender: "",
      phone: u.mobile || u.phone_number || '',
      consultationFee: '',
      chipLabel: '',
      rating: 0,
      accept_emergency_patients: false,
      
      licenseFile: null,
      workingHours: {
        monday: { start: '', end: '' },
        tuesday: { start: '', end: '' },
        wednesday: { start: '', end: '' },
        thursday: { start: '', end: '' },
        friday: { start: '', end: '' },
        saturday: { start: '', end: '' },
        sunday: { start: '', end: '' },
      },
      avatarUrl: '',
      hospitalDetail: [{
        hospitalName: '',
        flatNo: '',
        building: '',
        street: '',
        area: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
        pinCode: '',
      }],
    },
    loading: false,
    error: null,
    successMessage: null,
    isEditing: false,
  };
};

const initialState = buildInitialState();


// Slice definition
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = { ...state.profileData, ...action.payload };
    },
    setDoctorExists: (state, action) => {
      state.doctorExists = action.payload;
    },
    setIsEditing: (state, action) => {
      state.isEditing = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setRating: (state, action) => {
      state.profileData.rating = action.payload;
    },
    handleFieldChange: (state, action) => {
      const { field, value } = action.payload;
      state.profileData[field] = value;
    },
    handleWorkingHoursChange: (state, action) => {
      const { day, field, value } = action.payload;
      state.profileData.workingHours[day][field] = value;
    },
    handleHospitalChange: (state, action) => {
      const { index, field, value } = action.payload;
      state.profileData.hospitalDetail[index][field] = value;
    },
    handleAddHospital: (state) => {
      state.profileData.hospitalDetail.push({
        hospitalName: '',
        flatNo: '',
        building: '',
        street: '',
        area: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
        pinCode: '',
      });
    },
    handleRemoveHospital: (state, action) => {
      const index = action.payload;
      if (state.profileData.hospitalDetail.length > 1) {
        state.profileData.hospitalDetail.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorProfile.fulfilled, (state, action) => {
    console.log("PROFILE API:", action.payload);

    state.loading = false;

    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const apiData = action.payload || {};

    const transformedData = transformApiDataToForm(apiData, userData);

    console.log("TRANSFORMED:", transformedData);

    state.profileData = transformedData;
})
      .addCase(fetchDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // API fail hone pe bhi localStorage ka data dikhao
        const u = getLocalUserData();
        if (u.name || u.full_name || u.email) {
          state.profileData.name = state.profileData.name || u.name || u.full_name || '';
          state.profileData.email = state.profileData.email || u.email || '';
          state.profileData.phone = state.profileData.phone || u.mobile || u.phone_number || '';
        }
      })


      // Update profile
      .addCase(updateDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDoctorProfile.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = SUCCESS_MESSAGES.PROFILE_UPDATED;
        state.isEditing = false;
      })
      .addCase(updateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload license
      .addCase(uploadLicense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLicense.fulfilled, (state, action) => {
        state.loading = false;
          state.profileData.licenseFiles = [
        ...(state.profileData.licenseFiles || []),
        action.payload
    ];

        state.successMessage = SUCCESS_MESSAGES.LICENSE_UPLOADED;
      })
      .addCase(uploadLicense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload profile image
      .addCase(uploadProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData.avatarUrl = action.payload;
        state.successMessage = SUCCESS_MESSAGES.IMAGE_UPLOADED;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setProfileData,
  setDoctorExists,
  setIsEditing,
  clearError,
  clearSuccessMessage,
  setRating,
  handleFieldChange,
  handleWorkingHoursChange,
  handleHospitalChange,
  handleAddHospital,
  handleRemoveHospital,
} = profileSlice.actions;

// Selectors
export const selectProfileData = (state) => state.profile.profileData;

export const selectProfileLoading = (state) => state.profile.loading;
export const selectProfileError = (state) => state.profile.error;
export const selectProfileSuccessMessage = (state) => state.profile.successMessage;
export const selectIsEditing = (state) => state.profile.isEditing;

// Export reducer
export default profileSlice.reducer;

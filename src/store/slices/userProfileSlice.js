import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";

const initialState = {
  userProfile: null,
  loading: false,
  error: null,
};

/* Slice */
const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Error handle
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // User profile success
    setUserProfile: (state, action) => {
      state.loading = false;
      state.userProfile = action.payload;
      state.error = null;
    },

    // Clear user profile
    clearUserProfile: (state) => {
      state.userProfile = null;
      state.error = null;
    },

    // Clear error only
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  startLoading,
  setError,
  setUserProfile,
  clearUserProfile,
  clearError,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;

/*
----------------------------------
Async API Functions 
----------------------------------  
*/

// Fetch User Profile
export const fetchUserProfile = () => async (dispatch) => {
  try {
  
    dispatch(startLoading());

    // Get token from localStorage
    const token = localStorage.getItem('token');
  
    
    if (!token) {
      console.log("No token found");
      dispatch(setError("No authentication token found"));
      return;
    }

    console.log("Making API call to:", `${API_BASE_URL}${API_ENDPOINTS.GET_USER_PROFILE}`);
    
    const response = await axios.get(
      `${API_BASE_URL}${API_ENDPOINTS.GET_USER_PROFILE}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );


    if (response.data?.success) {
     
      dispatch(setUserProfile(response.data.data));
    } else {
      
      dispatch(setError("Failed to fetch user profile"));
    }
  } catch (error) {
    console.log("API call error:", error);
    dispatch(
      setError(error.response?.data?.message || "Error fetching user profile")
    );
  }
};

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserProfile, clearUserProfile, clearError } from './slices/userProfileSlice';

// Custom hook for user profile
export const useUserProfile = () => {
  const dispatch = useAppDispatch();
  const { userProfile, loading, error } = useAppSelector((state) => state.userProfile);

  const getUserProfile = () => {
    dispatch(fetchUserProfile());
  };

  const clearProfile = () => {
    dispatch(clearUserProfile());
  };

  const clearProfileError = () => {
    dispatch(clearError());
  };

  return {
    userProfile,
    loading,
    error,
    getUserProfile,
    clearProfile,
    clearProfileError,
  };
};

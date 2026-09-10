'use client';
import { Provider } from 'react-redux';
import store from './index';

export default function DoctorProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}

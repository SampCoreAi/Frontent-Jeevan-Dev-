import DoctorProvider from './store/DoctorProvider';

export default function DoctorLayout({ children }) {
  return <DoctorProvider>{children}</DoctorProvider>;
}

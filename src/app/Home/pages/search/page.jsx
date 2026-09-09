import { Suspense } from "react";
import SearchPage from ".././../components/Search/Search1";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}
import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function PasswortZuruecksetzenPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
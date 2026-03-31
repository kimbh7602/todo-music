"use client";

import dynamic from "next/dynamic";

const AuthProvider = dynamic(() => import("@/components/AuthProvider"), {
  ssr: false,
});

export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}

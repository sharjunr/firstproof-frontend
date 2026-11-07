import type { ApiResult } from "./types";
// Only select server mode when compatible authenticated endpoints exist.
export const dataMode =
  process.env.NEXT_PUBLIC_DATA_MODE === "server" ? "server" : "demo";
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const payload: ApiResult<T> = await response.json();
  if (!response.ok || !payload.success || !payload.data)
    throw new Error(
      payload.error?.message || "The server could not complete this request.",
    );
  return payload.data;
}
export const contracts = {
  session: "/auth/me",
  signIn: "/auth/sign-in",
  register: "/auth/register",
  signOut: "/auth/sign-out",
  opportunities: "/opportunities",
  applications: "/applications",
  uploads: "/uploads",
};

// Future integration: the server must enforce first-stage field projections and consent.
export const hiringContracts={join:"/applications/join",requestBackground:"/applications/:id/background-request",respondBackground:"/applications/:id/background-response",employerMaterials:"/opportunities/:id/materials",rubricEvaluation:"/applications/:id/evaluation"};

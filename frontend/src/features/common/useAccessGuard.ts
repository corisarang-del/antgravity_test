import { useMemo } from "react";

type UseAccessGuardInput = {
  isLoggedIn: boolean;
};

export function useAccessGuard({ isLoggedIn }: UseAccessGuardInput) {
  return useMemo(
    () => ({
      canViewDashboard: true,
      canViewBasis: true,
      canManageWatchlist: isLoggedIn,
      canManageAlerts: isLoggedIn,
    }),
    [isLoggedIn],
  );
}

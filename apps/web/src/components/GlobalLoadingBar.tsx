import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export function GlobalLoadingBar() {
  const isBusy = useIsFetching() + useIsMutating() > 0;
  if (!isBusy) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 top-0 z-[1000] h-1 overflow-hidden bg-cyan-500/15"
      role="progressbar"
      aria-label="Loading"
    >
      <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 via-amber-300 to-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />
    </div>
  );
}

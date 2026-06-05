import { useIsFetching, useIsMutating } from '@tanstack/react-query';


export function GlobalLoadingBar() {
  const isBusy = useIsFetching() + useIsMutating() > 0;
  if (!isBusy) {
    return null;
  }
  return <div className="global-loading-bar" role="progressbar" aria-label="Loading" />;
}

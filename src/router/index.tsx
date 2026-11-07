import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface RouteState {
  pathname: string;
  hash: string;
  params: Record<string, string>;
}

interface RouterContextType extends RouteState {
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  hash: '',
  params: {},
  navigate: () => {},
});

function parseLocation(): RouteState {
  if (typeof window === 'undefined') {
    return { pathname: '/', hash: '', params: {} };
  }

  const rawPath = window.location.pathname || '/';
  // Normalize trailing slash (unless root)
  const pathname = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  const hash = window.location.hash || '';

  // Match /explore-india/:region
  const matchRegion = pathname.match(/^\/explore-india\/([a-zA-Z0-9_-]+)$/);
  const params: Record<string, string> = {};
  if (matchRegion) {
    params.region = matchRegion[1].toLowerCase();
  }

  return { pathname, hash, params };
}

export const RouterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<RouteState>(parseLocation());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;

    // Check if it's an in-page hash anchor on the same page
    if (to.startsWith('#')) {
      const el = document.getElementById(to.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', to);
        setRoute((prev) => ({ ...prev, hash: to }));
      }
      return;
    }

    // Full or relative path
    const url = new URL(to, window.location.origin);
    const newPath = url.pathname;
    const newHash = url.hash;

    if (window.location.pathname !== newPath || window.location.hash !== newHash) {
      window.history.pushState(null, '', to);
      const parsed = parseLocation();
      setRoute(parsed);

      if (!newHash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(newHash.slice(1));
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      }
    }
  }, []);

  return (
    <RouterContext.Provider value={{ ...route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);


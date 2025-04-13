import { useEffect } from 'react';

export function useNavbarBehavior(navbarRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = navbarRef.current;
      if (!navbar) return;

      const scrollTop = window.scrollY;
      const isTransparent = navbar.classList.contains('transparent');
      const isOpened = navbar.classList.contains('opened');

      if (isTransparent && !isOpened) {
        if (scrollTop > 0) {
          navbar.classList.remove('bg-color');
        } else {
          navbar.classList.add('bg-color');
        }
      }

      if (scrollTop > 0) {
        navbar.classList.add('navbar-short');
      } else {
        navbar.classList.remove('navbar-short');
      }
    };

    const handleResize = () => {
      document.body.classList.remove('navbar-dropdown-open');

      if (navbarRef.current) {
        navbarRef.current.classList.remove('opened');
        const toggler = navbarRef.current.querySelector('.navbar-toggler');
        if (toggler && toggler instanceof HTMLElement) {
          toggler.setAttribute('aria-expanded', 'false');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    handleScroll(); // run on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [navbarRef]);
}

export default useNavbarBehavior;
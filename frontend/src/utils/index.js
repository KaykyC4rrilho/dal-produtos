export const createPageUrl = (pageName) => {
  const routes = {
    'Home': '/',
    'Product': '/product'
  };
  return routes[pageName] || '/';
};

// Função cn para classes CSS
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
/**
 * Gran Colinos — SPA Router (hash-based)
 * Lightweight, no dependencies.
 */

export class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.onNavigate = null;
    window.addEventListener('hashchange', () => this._resolve());
    window.addEventListener('load', () => this._resolve());
  }

  add(path, handler) {
    const paramNames = [];
    const pattern = path.replace(/:(\w+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
    this.routes.push({ path, pattern: new RegExp(`^${pattern}$`), paramNames, handler });
    return this;
  }

  navigate(path) {
    window.location.hash = path;
  }

  getCurrentPath() {
    return window.location.hash.slice(1) || '/';
  }

  _resolve() {
    const path = this.getCurrentPath();
    for (const route of this.routes) {
      const match = path.match(route.pattern);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
        this.currentRoute = { path: route.path, params };
        route.handler({ params, path });
        if (this.onNavigate) this.onNavigate({ params, path, routePath: route.path });
        return;
      }
    }
    // 404 — fallback to home
    this.navigate('/');
  }
}

export const router = new Router();

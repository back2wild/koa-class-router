import Koa from 'koa';

export type RouteMethods = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
export type RouteHandler = (ctx: Koa.Context) => Promise<any>;
export type RouteFn = (ctx: Koa.Context, next: Koa.Next) => Promise<void>;

export abstract class KCRRoutes {
  public get routes() {
    return (this as any)['_routes'] as RouteFn[];
  }
  constructor() {
  }
}

export function Routes(options?: {
  basePath?: string;
}) {
  return <T extends { new (...args: any[]): KCRRoutes }>(C: T) => {
    const defaultBasePath = '/' + C.name;
    const {
      basePath: pBasePath = defaultBasePath,
    } = options || {};

    C.prototype._basePath = pBasePath;

    return class extends C {
      constructor(...args: any[]) {
        super(args);
      }
    };
  };
}

export function Route(options?: {
  method?: RouteMethods;
  path?: string | RegExp;
}) {
  return (prototype: any, memberName: string, descriptor: PropertyDescriptor) => {
    const defaultPath = '/' + memberName;

    const {
      method: pMethod = 'GET',
      path: pPath = defaultPath,
    } = options || {};

    const isPathRegExp = pPath instanceof RegExp;
    const handler = descriptor.value as RouteHandler;

    const route = async (ctx: Koa.Context, next: Koa.Next) => {
      if (ctx.request.method.toUpperCase() !== pMethod) {
        await next();
        return;
      }
      let match = false;
      if (isPathRegExp) {
        const pathWithBaseSubstracted = ctx.request.path.replace(prototype._basePath, '');
        match = (pPath as RegExp).test(pathWithBaseSubstracted);
      } else {
        const joinedPath = isPathRegExp ? null : (prototype._basePath + pPath);
        match = ctx.request.path === joinedPath;
      }
      if (match) {
        await handler(ctx);
      }
      await next();
    };
    if (!prototype._routes) {
      prototype._routes = [];
    }
    prototype._routes.push(route);
  };
}

# @back2wild/koa-class-router

> A typescript class decorator based router for koajs

## Example

```typescript
import { Routes, Route, KCRRoutes } from '@back2wild/koa-class-router';

@Routes()
class User extends KCRRoutes {
  @Route({
    method: 'POST',
  })
  public async login(ctx: Koa.Context) {
    ctx.response.body = {
      message: 'OK'
    };
    ctx.response.type = 'application/json';
  }
}

const userRoutes = new User();
userRoutes.routes.forEach((r) => {
  app.use(r);
});
```

Now, the request `POST /User/login` will be route to method `User.login`.

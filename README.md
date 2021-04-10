# @back2wild/koa-class-router

A typescript class decorator based router for koajs

## Usage

```bash
npm install --save @back2wild/koa-class-router
```

## Example

```typescript
import { Routes, Route, KCRRoutes } from '@back2wild/koa-class-router';

@Routes()
class User extends KCRRoutes {
  @Route({
    method: 'POST',
  })
  public async login(ctx: Koa.Context) {
    ctx.response.type = 'application/json';
    ctx.response.body = {
      message: 'OK'
    };
  }
}

const userRoutes = new User();
userRoutes.routes.forEach((r) => {
  app.use(r);
});
```

Now, the request `POST /User/login` will be route to method `User.login`.

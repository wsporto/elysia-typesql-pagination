import { Elysia, t } from "elysia";
import { createConnection } from "mysql2/promise";
import { selectProducts } from "./sqls";

const conn = await createConnection({
  host: 'localhost',
  database: 'classicmodels',
  user: 'root',
  password: 'password'
});

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get('/products', ({ query }) => {
    const pageSize = query.pageSize || 10;
    const pageIndex = query.pageIndex || 0;
    return selectProducts(conn, {
      offset: pageIndex * pageSize,
      limit: pageSize
    });
  },
    {
      query: t.Object({
        pageIndex: t.Numeric(),
        pageSize: t.Numeric()
      })
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

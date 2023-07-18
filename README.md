Create the project using the elysia template and open in the vscode

```bash
bun create elysia elysia-typesql-pagination
code elysia-typesql-pagination
```

Add the `mysql2` driver and `@types/node` dependency.

```bash
bun add mysql2
bun add -d @types/node
```

Add `typesql` as dev dependency.

```bash
bun add -d typesql-cli
```

Now lets run the database as a docker container. The image contains the [sample database](https://www.mysqltutorial.org/mysql-sample-database.aspx) from the mysqltutorial.

```bash
docker run -d --name classicmodels -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password wsporto/classicmodels-mysql:8.0
```

Use the `typesql init` to create the `typesql.json` configuration file.

```bash
bunx typesql-cli init
```

Update the `databaseUri` and `sqlDir` in the `typesql.json` file:

```json
{
    "databaseUri": "mysql://root:password@localhost/classicmodels",
    "sqlDir": "./src/sqls",
    "target": "node"
}
```

Create the SQL query in the file `sqls/select-products.sql`.

```sql
SELECT
    productCode,
    productName,
    productDescription
FROM products
ORDER BY productName
LIMIT :offset, :limit
```

PS: A scaffolding query can be generated with the typesql command:
`bunx typesql-cli generate select select-products.sql --table products`

Now run the command bellow and TypeSQL will generate a type-safe API to execute the query.

```bash
bunx typesql-cli compile --watch
```

# Into the code

In the src/index.ts, update the Elysia server to create the `products` endpoint:

```diff
+import { Elysia, t } from "elysia";
+import { createConnection } from "mysql2/promise";
+import { selectProducts } from "./sqls";

+const conn = await createConnection({
+  host: 'localhost',
+  database: 'classicmodels',
+  user: 'root',
+  password: 'password'
+});

const app = new Elysia()
  .get("/", () => "Hello Elysia")
+  .get('/products', ({ query }) => {
+    const pageSize = query.pageSize || 10;
+    const pageIndex = query.pageIndex || 0;
+    return selectProducts(conn, {
+      offset: pageIndex * pageSize,
+      limit: pageSize
+    });
+  },
+    {
+      query: t.Object({
+        pageIndex: t.Numeric(),
+        pageSize: t.Numeric()
+      })
+    }
+)
    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

Start the server in dev mode:
```shell
bun run dev
```

Now you have the endpoint for products with pagination: 

```
http://localhost:3000/products?pageIndex=0&pageSize=100
```
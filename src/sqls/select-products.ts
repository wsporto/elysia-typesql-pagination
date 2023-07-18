import { Connection } from 'mysql2/promise';

export type SelectProductsParams = {
    offset: number;
    limit: number;
}

export type SelectProductsResult = {
    productCode: string;
    productName: string;
    productDescription: string;
}

export async function selectProducts(connection: Connection, params: SelectProductsParams) : Promise<SelectProductsResult[]> {
    const sql = `
    SELECT
        productCode,
        productName,
        productDescription
    FROM products
    ORDER BY productName
    LIMIT ?, ?
    `

    return connection.query(sql, [params.offset, params.limit])
        .then( res => res[0] as SelectProductsResult[] );
}
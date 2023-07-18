SELECT
    productCode,
    productName,
    productDescription
FROM products
ORDER BY productName
LIMIT :offset, :limit
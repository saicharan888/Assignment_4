
/* eslint linebreak-style: ["error", "windows"] */
/* global db print */
/* eslint no-restricted-globals: "off" */

const productDB = [
  {
    id: 1, category: 'Shirts', name: 'Allensolly Shirt', price: 10.90, image: 'https://www.pinterest.com/pin/727753621013110598/',
  },
];

db.products.insertMany(productDB);
const count = db.products.count();
print('Inserted', count, 'products');

db.counters.remove({ _id: 'products' });
db.counters.insert({ _id: 'products', current: count });

db.products.createIndex({ id: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ name: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ image: 1 });

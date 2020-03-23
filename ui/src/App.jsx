/* eslint "react/react-in-jsx-scope": "off" */

/* globals React ReactDOM */

/* eslint linebreak-style: ["error", "windows"] */

/* eslint no-restricted-globals: "off" */

const contentNode = document.getElementById('contents');
function ProductAvailable(props) {
  const { products } = props;
  const productRows = products.map(product => <ProductRow key={product.id} product={product} />);
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>{productRows}</tbody>
    </table>
  );
}

/* eslint "react/jsx-no-undef": "off" */

/* eslint "no-alert": "off" */

function ProductRow(props) {
  const { product } = props;
  const {
    name, price, category, image,
  } = product;
  return (
    <tr>
      <td>{name}</td>
      <td>
        $
        {price}
      </td>
      <td>{category}</td>
      <td><a href={image} target="_blank"> View</a></td>
    </tr>
  );
}

/* eslint jsx-a11y/label-has-associated-control: "off" */

/* eslint jsx-a11y/label-has-for: "off" */

class ProductAdd extends React.Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const form = document.forms.productAdd;
    const { createProduct } = this.props;
    createProduct({
      id: form.id.value,
      name: form.productName.value,
      price: form.price.value,
      category: form.category.value,
      image: form.Image_URL.value,
    });
    form.productName.value = '';
    form.price.value = '';
    form.Image_URL.value = '';
  }

  /* eslint react/jsx-no-target-blank: "off" */

  /* eslint linebreak-style: "off" */

  render() {
    return (
      <div>

        <form name="productAdd" onSubmit={this.onSubmit}>
          <div className="gridview">
            <label>Category</label>
            <br />
            <select name="category">
              <option value="Shirts">Shirts</option>
              <option value="Jeans">Jeans</option>
              <option value="Jackets">Jackets</option>
              <option value="Sweaters">Sweaters</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="gridview">
            <label>Price Per Unit </label>
            {' '}
            <br />
            <input type="text" name="price" placeholder="$" />
          </div>
          <div className="gridview">
            <label> Product Name</label>
            <br />
            <input type="text" name="productName" />
          </div>
          <div className="gridview">
            <label>Image URL</label>
            <br />
            <input type="text" name="Image_URL" placeholder="URL" />
          </div>
          <div>
            <button type="submit">Add Product</button>
          </div>
        </form>
      </div>
    );
  }
}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products:
      [],
    };
    this.createProduct = this.createProduct.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
      productList{
        id name price category image
      }
    }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    this.setState({ products: result.data.productList });
  }

  async createProduct(product) {
    const query = `mutation addProduct($product: ProductInputs!) {
        addProduct(product: $product) {
          id
        }
      }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { product } }),
    });
    if (response) { this.loadData(); }
  }

  render() {
    const { products = [] } = this.state;
    return (
      <div>
        <h1>My Company Inventory</h1>
        <h2>Showing all available products</h2>
        <hr />
        <ProductAvailable products={products} />
        <h2>Add a new product to inventory</h2>
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </div>
    );
  }
}
ReactDOM.render(<ProductList />, contentNode);

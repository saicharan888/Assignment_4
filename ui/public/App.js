/* eslint "react/react-in-jsx-scope": "off" */

/* globals React ReactDOM */

/* eslint linebreak-style: ["error", "windows"] */

/* eslint no-restricted-globals: "off" */
const contentNode = document.getElementById('contents');

function ProductAvailable(props) {
  const {
    products
  } = props;
  const productRows = products.map(product => React.createElement(ProductRow, {
    key: product.id,
    product: product
  }));
  return React.createElement("table", {
    className: "bordered-table"
  }, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Product Name"), React.createElement("th", null, "Price"), React.createElement("th", null, "Category"), React.createElement("th", null, "Image"))), React.createElement("tbody", null, productRows));
}
/* eslint "react/jsx-no-undef": "off" */

/* eslint "no-alert": "off" */


function ProductRow(props) {
  const {
    product
  } = props;
  const {
    name,
    price,
    category,
    image
  } = product;
  return React.createElement("tr", null, React.createElement("td", null, name), React.createElement("td", null, "$", price), React.createElement("td", null, category), React.createElement("td", null, React.createElement("a", {
    href: image,
    target: "_blank"
  }, " View")));
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
    const {
      createProduct
    } = this.props;
    createProduct({
      id: form.id.value,
      name: form.productName.value,
      price: form.price.value,
      category: form.category.value,
      image: form.Image_URL.value
    });
    form.productName.value = '';
    form.price.value = '';
    form.Image_URL.value = '';
  }
  /* eslint react/jsx-no-target-blank: "off" */


  render() {
    return React.createElement("div", null, React.createElement("form", {
      name: "productAdd",
      onSubmit: this.onSubmit
    }, React.createElement("div", {
      className: "gridview"
    }, React.createElement("label", null, "Category"), React.createElement("br", null), React.createElement("select", {
      name: "category"
    }, React.createElement("option", {
      value: "Shirts"
    }, "Shirts"), React.createElement("option", {
      value: "Jeans"
    }, "Jeans"), React.createElement("option", {
      value: "Jackets"
    }, "Jackets"), React.createElement("option", {
      value: "Sweaters"
    }, "Sweaters"), React.createElement("option", {
      value: "Accessories"
    }, "Accessories"))), React.createElement("div", {
      className: "gridview"
    }, React.createElement("label", null, "Price Per Unit "), ' ', React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "price",
      placeholder: "$"
    })), React.createElement("div", {
      className: "gridview"
    }, React.createElement("label", null, " Product Name"), React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "productName"
    })), React.createElement("div", {
      className: "gridview"
    }, React.createElement("label", null, "Image URL"), React.createElement("br", null), React.createElement("input", {
      type: "text",
      name: "Image_URL",
      placeholder: "URL"
    })), React.createElement("div", null, React.createElement("button", {
      type: "submit"
    }, "Add Product"))));
  }

}

class ProductList extends React.Component {
  constructor() {
    super();
    this.state = {
      products: []
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const result = await response.json();
    this.setState({
      products: result.data.productList
    });
  }

  async createProduct(product) {
    const query = `mutation addProduct($product: ProductInputs!) {
        addProduct(product: $product) {
          id
        }
      }`;
    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables: {
          product
        }
      })
    });

    if (response) {
      this.loadData();
    }
  }

  render() {
    const {
      products = []
    } = this.state;
    return React.createElement("div", null, React.createElement("h1", null, "My Company Inventory"), React.createElement("h2", null, "Showing all available products"), React.createElement("hr", null), React.createElement(ProductAvailable, {
      products: products
    }), React.createElement("h2", null, "Add a new product to inventory"), React.createElement("hr", null), React.createElement(ProductAdd, {
      createProduct: this.createProduct
    }));
  }

}

ReactDOM.render(React.createElement(ProductList, null), contentNode);
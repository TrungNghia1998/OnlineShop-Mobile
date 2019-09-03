import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    // Any async code you want!
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        "https://rn-complete-guide-2b3fd.firebaseio.com/products.json",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        // ok default ok is true if 200 status code
        throw new Error("Something went wrong!");
      }

      const responseData = await response.json();
      const loadedProducts = [];

      for (const key in responseData) {
        loadedProducts.push(
          new Product(
            key,
            responseData[key].ownerId,
            responseData[key].title,
            responseData[key].imageUrl,
            responseData[key].description,
            responseData[key].price
          )
        );
      }
      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(
          product => product.ownerId === userId
        ),
      });
    } catch (error) {
      // send to custom analytics server
      throw error;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-complete-guide-2b3fd.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_PRODUCT, productId: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // Any async code you want!
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://rn-complete-guide-2b3fd.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
        }),
      }
    );

    const responseData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: responseData.name,
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        ownerId: userId,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-complete-guide-2b3fd.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      productId: id,
      productData: {
        title: title,
        description: description,
        imageUrl: imageUrl,
      },
    });
  };
};

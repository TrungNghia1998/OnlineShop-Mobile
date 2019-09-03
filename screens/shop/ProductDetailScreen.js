import React from "react";
import {
  ScrollView,
  Text,
  Image,
  View,
  Button,
  StyleSheet,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam("productId");
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(product => product.id === productId)
  );

  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{uri: selectedProduct.imageUrl}} />
      <View style={styles.action}>
        <Button color={Colors.primary} title="Add To Cart" onPress={() => {
          dispatch(cartActions.addToCart(selectedProduct))
        }} />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },
  action: {
    marginVertical: 10,
    alignItems: 'center'
  },
  price: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold',
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }
});

ProductDetailScreen.navigationOptions = navigationData => {
  return {
    headerTitle: navigationData.navigation.getParam("productTitle"),
  };
};

export default ProductDetailScreen;

import React, { useCallback, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, FlatList, Dimensions, ScrollView } from 'react-native'
import { Container, Header, Icon, Item, Input, Text } from 'native-base';
import { useFocusEffect } from '@react-navigation/native'
import ProductList from './ProductList'
import SearchProducts from './SearchedProducts';
import Banner from '../../Shared/Banner';
import CategoryFilter from './CategoryFilter';
import axios from 'axios';
import baseUrl from "../../assets/common/baseUrl"

const productsCategories = require('../../assets/data/categories.json')



var { height } = Dimensions.get('window')
const ProductContainer = (props) => {

    const [products, setProducts] = useState([]);
    const [productsFiltered, setProductsFiltered] = useState([])
    const [focus, setFocus] = useState();
    const [categories, setCategories] = useState([])
    const [productsCtg, setProductsCtg] = useState([])
    const [active, setActive] = useState()
    const [initialState, setInitialState] = useState([])
    const [loading, setLoading] = useState(true)

    useFocusEffect((
        useCallback(
            () => {
                setFocus(false);
                setActive(-1);

                // Products
                axios
                    .get(`${baseUrl}products`)
                    .then((res) => {
                        setProducts(res.data);
                        setProductsFiltered(res.data);
                        setProductsCtg(res.data);
                        setInitialState(res.data);
                        setLoading(false)
                    })
                    .catch((error) => {
                        console.log('Api call error' , error)
                    })

                // Categories
                axios
                    .get(`${baseUrl}categories`)
                    .then((res) => {
                        console.log("RES DATA " + res.data);
                        setCategories(res.data)
                    })
                    .catch((error) => {
                        
                        console.log('Api call error' , error)
                    })

                return () => {
                    setProducts([]);
                    setProductsFiltered([]);
                    setFocus();
                    setCategories([]);
                    setActive();
                    setInitialState();
                };
            },
            [],
        )
    ))

    const searchProduct = (text) => {
        setProductsFiltered(
            products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
        )
    }

    const openList = () => {
        setFocus(true);
    }

    const onBlur = () => {
        setFocus(false)
    }

    const changeCtg = (ctg) => {

        console.log('sdfsdfsfsdfsfdsfsdfsdfsdfsdf');
        if (ctg === "all") {
            setProductsCtg(initialState)
            setActive(true)
        } else {
            console.log('current ctg = ', ctg);
            setProductsCtg(
                products.filter((i) => {
                    console.log("i.cat._ID = ", i.category._id, " is it true? ", i.category._id === ctg);
                    return i.category._id === ctg
                })

            )
            setActive(true)
        }

        // {
        //   ctg === "all"
        //     ? [setProductsCtg(initialState), setActive(true)]
        //     : [
        //         setProductsCtg(
        //           products.filter((i) => i.category._id === ctg),
        //           setActive(true)
        //         ),
        //       ];
        // }
    };

    console.log("productsCtg.length = ", productsCtg.length);

    return (

        <>
            {loading == false ? (
                <Container>
                    <Header searchBar rounded>
                        <Item>
                            <Icon name="ios-search" />
                            <Input
                                placeholder="Search"
                                onFocus={openList}
                                onChangeText={(text) => searchProduct(text)}
                            />
                            {focus == true ? <Icon onPress={onBlur} name="ios-close" /> : null}
                        </Item>
                    </Header>
                    {focus == true ? (
                        <SearchedProduct
                            navigation={props.navigation}
                            productsFiltered={productsFiltered} />
                    ) : (
                        <ScrollView>
                            <View>
                                <View>
                                    <Banner />
                                </View>
                                <View>
                                    <CategoryFilter
                                        categories={categories}
                                        categoryFilter={changeCtg}
                                        productsCtg={productsCtg}
                                        active={active}
                                        setActive={setActive}
                                    />
                                </View>
                                {productsCtg.length > 0 ? (
                                    <View style={styles.listContainer}>
                                        {productsCtg.map((item) => {
                                            return (
                                                <ProductList
                                                    navigation={props.navigation}
                                                    key={item.name}
                                                    item={item}
                                                />
                                            )
                                        })}
                                    </View>
                                ) : (
                                    <View style={[styles.center, { height: height / 2 }]}>
                                        <Text>No products found</Text>
                                    </View>
                                )}

                            </View>
                        </ScrollView>
                    )}
                </Container>
            ) : (
                // Loading
                <Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
                    <ActivityIndicator size="large" color="red" />
                </Container>
            )}
        </>
    )


}

const styles = StyleSheet.create({
    container: {
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    listContainer: {
        height: height,
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        backgroundColor: "gainsboro",
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
export default ProductContainer;

import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Content, Left, Body, ListItem, Thumbnail, Text } from 'native-base';

var { width } = Dimensions.get("window")
const SearchProducts = (props) => {

    const { productsFiltered } = props

    return (
        <Content style={{ width: width }} >
            {productsFiltered.length > 0 ? (productsFiltered.map((item) => {

                console.log("searchedProducts.js ", item)
                return ((
                    <ListItem
                        onPress={() => {
                            props.navigation.navigate("Product Detail", { item: item })
                        }}
                        key={item.id}
                        avatar  >
                        <Left>
                            <Thumbnail
                                source={{ url: item.image ? item.image : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png" }}
                            />
                        </Left>
                        <Body>
                            <Text> {item.name}</Text>
                            <Text note>{item.description}</Text>
                        </Body>
                    </ListItem>


                ))
            })

            ) : (
                <View>
                    <Text style={{ alignSelf: 'center' }} >No matching productss </Text>
                </View>
            )


            }
        </Content>
    )
}

const styles = StyleSheet.create({
    center: {
        justifyContent: "center",
        alignItems: 'center',
    }
})

export default SearchProducts
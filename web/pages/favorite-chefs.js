import React, { Component } from 'react';
import FavoriteChefsScreen from '../components/favorite-chef/FavoriteChef.Screen';
import {withApollo} from '../apollo/apollo';

const Index = () =>{
    return <FavoriteChefsScreen />;
}
export default withApollo(Index);

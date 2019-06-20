import React, {Component} from 'react';
import io from 'socket.io-client';

import {View, Image, TouchableOpacity, FlatList, Text, StyleSheet} from 'react-native';

import api from '../services/api';

import camera from '../assets/camera.png';
import more from '../assets/more.png';
import comment from '../assets/comment.png';
import like from '../assets/like.png';
import send from '../assets/send.png';

export default class Feed extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerRight: (
            <TouchableOpacity style={{marginRight: 20 }} onPress={()=> navigation.navigate('New')}>
                <Image source={camera} />
            </TouchableOpacity>
        ),
    });

    state = {
        feed: []
    };

    registerToSocket = () => {
        const socket = io('http://192.168.1.5:3001');
        
        socket.on('post', newPost => {
            this.setState({ feed: [newPost, ... this.state.feed]});
        });

        socket.on('like', likePost => {
            this.setState({
                feed: this.state.feed.map(post => 
                    post._id === likePost._id ? likePost : post
                )
            });
        });
    }

    handleLike = id => {
        api.get(`/posts/${id}/like`);
    }

    async componentDidMount() {

        this.registerToSocket();

        const response = await api.get('posts');

        console.log(response.data);

        this.setState({
            feed: response.data
        });
    }

    render() {
        return (
            <View style={styles.container}> 
                <FlatList 
                    data={this.state.feed}
                    keyExtractor={post => post._id}
                    renderItem={({item}) => (
                        <View style={styles.feedItem}>
                            <View style={styles.feedItemHeader}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.name}>{item.autor}</Text>
                                    <Text style={styles.place}>{item.local}</Text>
                                </View>
                                <Image source={more} />
                            </View>
                            <Image style={styles.feedImage} source={{uri: `http://192.168.1.5:3001/files/${item.imagem}`}} />
                            <View style={styles.feedItemFooter}>
                                <View style={styles.actions}>
                                    <TouchableOpacity style={styles.action} onPress={() => this.handleLike(item._id)}>
                                        <Image source={like} />
                                    </TouchableOpacity>                            
                                    <TouchableOpacity style={styles.action} onPress={() =>{}}>
                                        <Image source={comment} />
                                    </TouchableOpacity>  
                                    <TouchableOpacity style={styles.action} onPress={() =>{}}>
                                        <Image source={send} />
                                    </TouchableOpacity>  
                                </View>
                                <Text style={styles.likes}>{item.likes} curtidas</Text>
                                <Text style={styles.description}>{item.descricao}</Text>
                                <Text style={styles.hashtags}>{item.hashtags}</Text>
                            </View>
                        </View>
                    )} />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    feedItem: {
        marginTop: 20
    },
    feedItemHeader: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        color: '#000'
    },
    place: {
        fontSize: 12,
        color: '#666',
        marginTop: 2
    },
    feedImage: {
        width: '100%',
        height: 400,
        marginVertical: 15,
    },
    feedItemFooter: {
        paddingHorizontal: 15
    },
    actions: {
        flexDirection: 'row'
    },
    action: {
        marginRight: 8
    },
    likes: {
        marginTop: 15,
        fontWeight: 'bold',
        color: '#000'
    },
    description: {
        color: '#000',
        lineHeight: 18,
    },
    hashtags: {
        color: '#7159c1',
    }
});
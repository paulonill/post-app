import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';

import api from '../services/api';

import { View, StyleSheet, Image, TouchableOpacity, Text, TextInput } from 'react-native';

export default class New extends Component {

    static navigationOptions = ({
        headerTitle: 'Nova publicação'
    });

    state = {
        autor: '',
        descricao: '',
        local: '',
        hashtags: '',
        preview: null,
        imagem: null
    };

    hndleSubmit = async () => {
        const data = new FormData();
        
        data.append('imagem', this.state.imagem);
        data.append('autor', this.state.autor);
        data.append('local', this.state.local);
        data.append('descricao', this.state.descricao);
        data.append('hashtags', this.state.hashtags);

        await api.post('posts', data);

        this.props.navigation.navigate('Feed');
    }

    handleSelectImage = () => {
        ImagePicker.showImagePicker({
            title: 'Selecionar imagem'
        },
        upload => {
            if (upload.error) {
                console.log('Erro ao carregar a imagem');
            } else if (upload.didCancel) {
                console.log('Cancelado');
            } else {
                const preview = {
                    uri: `data:image/jpeg;base64,${upload.data}`,
                }

                let prefix;
                let ext;

                if (upload.fileName) {
                    [prefix, ext] = upload.fileName.split('.');
                    ext = ext.toLocaleLowerCase === 'heic' ? 'jpg' : ext;
                } else {
                    prefix = new Date().getTime();
                    ext = 'jpg';
                }

                const imagem = {
                    uri: upload.uri,
                    type: upload.type,
                    name: `${prefix}.${ext}`
                }

                this.setState({ preview, imagem });
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage}>
                    <Text style={styles.selectButtonText}>Selecione a imagem</Text>
                </TouchableOpacity>
                
                { this.state.preview && <Image style={styles.preview} source={this.state.preview} /> }

                <TextInput style={styles.input} 
                    autoCorrect={false} 
                    autoCapitalize="none"
                    placeholder="Nome do autor"
                    placeholderTextColor="#999"
                    value={this.state.autor}
                    onChangeText={ autor => this.setState( { autor }) } />
               
                <TextInput style={styles.input} 
                    autoCorrect={false} 
                    autoCapitalize="none"
                    placeholder="Local da foto"
                    placeholderTextColor="#999"
                    value={this.state.local}
                    onChangeText={ local => this.setState( { local }) } />
              
                <TextInput style={styles.input} 
                    autoCorrect={false} 
                    autoCapitalize="none"
                    placeholder="Descrição"
                    placeholderTextColor="#999"
                    value={this.state.descricao}
                    onChangeText={ descricao => this.setState( { descricao }) } />
               
                <TextInput style={styles.input} 
                    autoCorrect={false} 
                    autoCapitalize="none"
                    placeholder="Hashtags"
                    placeholderTextColor="#999"
                    value={this.state.hashtags}
                    onChangeText={ hashtags => this.setState( { hashtags }) } />                                                                            

                <TouchableOpacity style={styles.shareButton} onPress={this.hndleSubmit}>
                    <Text style={styles.shareButtonText}>Compartilhar</Text>
                </TouchableOpacity>                    
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 30,
    },
  
    selectButton: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#CCC',
      borderStyle: 'dashed',
      height: 42,
  
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    selectButtonText: {
      fontSize: 16,
      color: '#666',
    },
  
    preview: {
      width: 100,
      height: 100,
      marginTop: 10,
      alignSelf: 'center',
      borderRadius: 4,
    },
  
    input: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 15,
      marginTop: 10,
      fontSize: 16,
    },
  
    shareButton: {
      backgroundColor: '#7159c1',
      borderRadius: 4,
      height: 42,
      marginTop: 15,
  
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    shareButtonText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#FFF',
    },
  });
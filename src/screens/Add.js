import React, {useState} from 'react';
import * as RN from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../../config/fb';
import { useNavigation } from '@react-navigation/native';
import EmojiPicker from 'rn-emoji-keyboard';

export default function Add() {
    const [price, setPrice] = useState("");
    const [checkValidPrice, setCheckValidPrice] = useState(false);
    const [name, setName] = useState("");
    const [checkValidName, setCheckValidName] = useState(false);

    const navigation = useNavigation();
    const [isOpen, setIsOpen] = React.useState(false);
    const [newItem, setNewItem] = React.useState({
        emoji: '📷',
        name: '',
        price: '',
        isSold: false,
        createdAt: new Date(),
    });
    

    const handlePick = (emojiObject) => {
        setNewItem({
            ...newItem,
            emoji: emojiObject.emoji,
        });
      /* example emojiObject = { 
          "emoji": "❤️",
          "name": "red heart",
          "slug": "red_heart",
        }
      */
    }

      const onSend = async () => {
        if (!newItem.name.trim() || !newItem.price.trim()) {
            alert("Ingrese el nombre y precio del producto");
            return;
        }else if(checkValidPrice == true){
          alert("Ingrese un valor valido");
          return;
        }
        else{
            const docRef = await addDoc(collection(database, 'products'), newItem);
            navigation.goBack();

        }
       
      }

      const handleCheckPrice = text => {
        console.log(text);
        let re = /^\d{0,8}(\.\d{1,4})?$/;

        setPrice(text);
        setNewItem({...newItem, price: text})
        if (re.test(text) ) {
          setCheckValidPrice(false);
        } else {
          setCheckValidPrice(true);
        }
      };

      const handleCheckName = text => {
        console.log(text);
        let re = /^[A-Za-z-\s-A-Za-z-]+$/;

        setName(text);
        setNewItem({...newItem, name: text})
        if (re.test(text) ) {
          setCheckValidName(false);
        } else {
          setCheckValidName(true);
        }
      };


    return(
        <RN.View style={styles.container}>
            <RN.Text style={styles.title}>Vender un producto nuevo</RN.Text>
            <RN.Text onPress={() => setIsOpen(true)} style={styles.emoji}>{newItem.emoji}</RN.Text>
            <EmojiPicker
                onEmojiSelected={handlePick}
                open={isOpen}
                onClose={() => setIsOpen(false)} 
            />
            <RN.Text style={styles.textNote} >Nota: Para cambiar la imagen del producto, presiona sobre el icono de la camara</RN.Text>
                <RN.TextInput 
                    onChangeText={(text) => handleCheckName(text)}
                    style={styles.inputContainer} 
                    placeholder='Nombre del producto'
                    value={name} 
                />
                 {checkValidName ? (
                    <RN.Text style={styles.textFailed}>Ingrese un nombre valido</RN.Text>
                ):(
                    <RN.Text></RN.Text>
                )}
                <RN.TextInput 
                    onChangeText={(text) => handleCheckPrice(text) }
                    style={styles.inputContainer} 
                    placeholder='$ Precio' 
                    value={price}
                />
                {checkValidPrice ? (
                    <RN.Text style={styles.textFailed}>Precio ingresado invalido</RN.Text>
                ):(
                    <RN.Text></RN.Text>
                )}
            <RN.Button title='Publicar' onPress={onSend}/>
        </RN.View>
    )
}



const styles = RN.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginTop:12
    },
    inputContainer: {
        width: '90%',
        padding: 13,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
      },
    emoji: {
        fontSize: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        marginVertical: 6,
    },
    textFailed: {
        alignSelf: 'flex-end',
        color: 'red',
        marginRight:18
      },
      textNote:{
        color: 'red',
        marginBottom:12,
        marginTop:12,
        textAlign:"center"
      }

});

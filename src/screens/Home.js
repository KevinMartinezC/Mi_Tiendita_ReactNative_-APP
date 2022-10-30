import * as React from 'react';
import * as RN from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { database } from '../../config/fb';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import Product from '../components/Product';
import { Icon} from "react-native-elements";
export default function Home() {

    const [products, setProducts] = React.useState([]);
    const [count, setCount] = React.useState("");
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <RN.Button title='Añadir' onPress={() => navigation.navigate('Agregar')} />
        })
    },[navigation])

    React.useEffect(() => {
        const collectionRef = collection(database, 'products');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
        console.log('querySnapshot unsusbscribe');
        console.log(querySnapshot.size); 

        setCount(querySnapshot.size);
          setProducts(
            querySnapshot.docs.map(doc => ({
                id: doc.id,
                emoji: doc.data().emoji,
                name: doc.data().name,
                price: doc.data().price,
                isSold: doc.data().isSold,
                createdAt: doc.data().createdAt,
            }))
          );
        });
    return unsubscribe;
    },[])
   if(count!=0){
    return(
       
        <RN.View style={styles.container}>
            <RN.ScrollView contentContainerStyle={{paddingBottom: 100}}>
            <RN.Text style={styles.title}>Productos</RN.Text>
                {products.map(product => <Product key={product.id} {...product} />)}
            </RN.ScrollView>
        </RN.View>
    )
}else{
    return(
    <RN.View style={styles.content}>
    <Icon type='material-community' name='alert-outline' size={80}/>
    <RN.Text style={styles.text}>No hay productos en la base de datos o la aplicación se encuentra en mantenimiento</RN.Text>
  </RN.View>
    )
}
}

const styles = RN.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F3F9',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        margin: 16,
    },
    content:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    text:{
        fontSize:20,
        fontWeight:"bold",
        marginTop:20,
    }
});
import { useContext, useEffect, useState } from "react";
import { Alert, Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AuthContext } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation/RootNavigation";
import CreateReceipeForm from "../components/CreateReceipeForm";
import { Receipe, ReceipeContext } from "../context/ReceipeContext";
import ReceipeItem from "../components/ReceipeItem";


type HomescreenNavigationProps = NativeStackNavigationProp<RootStackParamsList, "Home">

interface HomescreenProps {
    navigation: HomescreenNavigationProps
}


const Homescreen: React.FC<HomescreenProps> = ({navigation}) => {
    const {signOut} = useContext(AuthContext)
    const [showModal, setshowModal] = useState(false)
    const [searchquery, setsearchquery] = useState('')
    const {createReceipe} = useContext(ReceipeContext)
    const {fetchReceipes, receipes} = useContext(ReceipeContext)

    useEffect(()=>{
     fetchReceipes()
    },[])
    const Handlelogout = async()=>{
        Alert.alert("Logout","Are you sure you want to logout?",
            [{text:"Cancel", style: "cancel"},{text:"Logout",onPress: async()=>{
                await signOut()
                navigation.replace("Loginscreen")
            }}])
    }

    const handleonCreateReceipeButtonSubmit = async(
        newReceipe:Omit<Receipe, '_id' | 'createdBy' | 'createdAt'>
   ) => {
    //    console.log(newReceipe)
    createReceipe(newReceipe)
    setshowModal(false)
   }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <TextInput
            value={searchquery}
            onChangeText={setsearchquery}
            placeholder="Search Recipes" style={styles.searchInput}/>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setshowModal(true)}>
                <Text style={styles.iconBtnText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={Handlelogout} style={styles.logoutBtn}>
                <Text>Logout</Text>
            </TouchableOpacity>
            </View>
            {/* <ReceipeList/> */}

           <FlatList
           data={receipes}
           renderItem={({item})=> <ReceipeItem receipe={item} onPressReceipeItem={() => navigation.navigate('ReceipeDetailsScreen', {ReceipeId: item._id})}/>}
           />


            {/* modal for creating new receipes */}
            <Modal
            visible={showModal}
            animationType="slide"
            onRequestClose={()=> setshowModal(false)}
            >
              <CreateReceipeForm onCancel={()=> setshowModal(false)} onSubmit={handleonCreateReceipeButtonSubmit}/>
            </Modal>
        </View>
    );

}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      color: '#f5f5f5'
    },
    header:{
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#007aff'
    },
    searchInput:{
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        marginRight: 15
    },
    iconBtn:{
        width: 40,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconBtnText:{
        fontSize: 24,
        color: '#007aff'
    },
    logoutBtn:{
        padding: 12,
        backgroundColor: '#0b0c0a',
        marginLeft: 12,
        borderRadius: 24
    },
    logoutBtnText:{
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14
    }
})

export default Homescreen
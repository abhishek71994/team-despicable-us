import React,{ Component } from 'react';
import {
	ScrollView,
	Text,
	TextInput,
	View,
	StyleSheet,
	TouchableOpacity,
	KeyboardAvoidingView,
	AsyncStorage,
} from 'react-native';
if(typeof global.self === "undefined")
{
    global.self = global;
}

export default class Login extends Component{
	construtor(props) {
		this.state = {
			username : '',
			password : ''
		}
	}
	componentDidMount(){
		this._loadInitState();
	}

	_loadInitState = async () => {
		const val = await AsyncStorage.getItem('user');
		if(val!=null){
			this.props.navigation.navigate('StudentTicket');
		}
	}
	login = () => {
		//the fetching thing
		// use post to send data to express and then express looks up the dB for records
		fetch('http://192.168.0.101:3001/api/login',{
			method : 'POST',
			headers : {
				'Accept' : 'application/json', 
				'Content-Type' : 'application/json', 
			},
			body : JSON.stringify({
				username : this.state.username,
				password : this.state.password
			})
		})
		.then((resp)=> {
			if(resp.status===201){
				return resp.json()
			}
			else{
				throw new Error("Not working");
			}
		})
		.then( (res) =>{
			//taking care of async storage later
			console.log(res);
			if(res.role === 'event-head'){
				this.props.navigation.navigate('Upload');
			}
			else if(res.role === 'student'){
			    this.props.navigation.navigate('StudentTicket',{id: res._id,username: res.username , enrollNo : res.enroll_no, dept : res.department, section : res.section, year: res.year});
			}
			else if(res.role === 'hod'){
				this.props.navigation.navigate('StudentPicker',{ dept: res.department });
			}
		} ).catch(function(error) {
			alert("Wrong username or password. Try again!");
		});
	}
	render(){
		return(
			<KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
				<View style={styles.container}>
					<Text 
					style={styles.header}>
						Login
					</Text>
					<TextInput placeholder='Username' 
					onChangeText = { (username) => {this.setState({ username: username })} }
					underlineColorAndroid = 'transparent'
					style={styles.textInput}/>
					<TextInput placeholder='Password' 
					onChangeText = { (password) => {this.setState({ password: password })} }
					underlineColorAndroid = 'transparent'
					secureTextEntry = {true}
					style={styles.textInput}/>
					<TouchableOpacity  style = {styles.button} onPress={this.login}><Text>Login</Text></TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
			)
	}
}

const styles = StyleSheet.create({
	wrapper:{
		flex : 1
	},
	container : {
		flex : 1,
		alignItems : 'center',
		justifyContent : 'center',
		backgroundColor : '#1abc9c',
		paddingLeft : 40,
		paddingRight : 40
	},
	header : {
		fontSize : 24,
		marginBottom : 60,
		color : '#fff',
		fontWeight : 'bold'
	},
	textInput : {
		alignSelf : 'stretch',
		padding : 16,
		marginBottom : 20,
		backgroundColor : '#fff'
	},
	button : {
		backgroundColor : '#16a085',
		alignSelf : 'stretch',
		padding : 20,
		alignItems : 'center'
	}
})
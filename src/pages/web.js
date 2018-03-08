/**
 * Created by zhangzuohua on 2018/1/19.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    Linking,
    View,
    Dimensions,
    Animated,
    Easing,
    PanResponder,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    StatusBar,
    InteractionManager,
    BackHandler,
    ScrollView,
    TouchableWithoutFeedback,
    RefreshControl,
    DeviceEventEmitter,
    LayoutAnimation,
    NativeModules,
    ImageBackground,
    FlatList,
    WebView,
    TextInput,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../utils/iphoneX';
import urlConfig from '../utils/urlConfig';
import IconSimple from 'react-native-vector-icons/SimpleLineIcons';
export  default  class web extends Component {
    static navigationOptions = {
        header:({navigation}) =>{
            return (
                <ImageBackground style={{...header}} source={require('../assets/backgroundImageHeader.png')} resizeMode='cover'>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    navigation.goBack(null);
                }}>
                    <View style={{justifyContent:'center',marginLeft:10,alignItems:'center',height:43.7}}>
                        <IconSimple name="arrow-left" size={20} color='white'/>
                    </View>
                </TouchableOpacity>
                <Text style={{fontSize:17,textAlign:'center',fontWeight:'bold',lineHeight:43.7,color:'white'}}> {navigation.state.routes[navigation.state.index].params && navigation.state.routes[navigation.state.index].params.WebTitle}</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                }}>
                    <View style={{justifyContent:'center',marginRight:10,alignItems:'center',height:43.7,backgroundColor:'transparent',width:20}}>
                    </View>
                </TouchableOpacity>
                </ImageBackground>
            )
        }

    };
    constructor(props) {
        super(props);
    }
    onNavigationStateChange(e) {
        this.props.navigation.setParams({
            WebTitle: e.title
        });
    }
//this.props.navigation.state.params.data.content && JSON.parse(this.props.navigation.state.params.data.content).content
    componentDidMount() {
        if (this.props.navigation.state.params && this.props.navigation.state.params.url){
            this.pubLishUrl = this.props.navigation.state.params.url;
        }

    }
    render() {
        return (
            <WebView source={{uri: this.pubLishUrl}} onNavigationStateChange={(e) => {
                this.onNavigationStateChange(e)
            }} startInLoadingState={true} />
        );
    }
    _onRefresh = () =>{};
}
const header = {
    backgroundColor: '#C7272F',
    ...ifIphoneX({
        paddingTop: 44,
        height: 88
    }, {
        paddingTop: Platform.OS === "ios" ? 20 : SCALE(StatusBarHeight()),
        height:64,
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'flex-end'
}






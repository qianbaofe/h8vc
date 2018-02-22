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
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
export  default  class web extends Component {
    static navigationOptions = {
        header:({navigation}) =>{
            return (
                <ImageBackground style={{...header}} source={require('../assets/backgroundImageHeader.png')} resizeMode='cover'>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    navigation.goBack();
                }}>
                    <View style={{justifyContent:'center',marginLeft:10,alignItems:'center',height:43.7}}>
                        <Image source={require('../assets/backIconWhite.png')} style={{width:20,height:20}}/>
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
        if (global.activeClassId === '0' || global.activeClassId === '1'){
            this.pubLishUrl = urlConfig.pubLishUrl;
        }else{
            this.pubLishUrl = urlConfig.pubLishUrl + '/?classid=' + global.activeClassId;
        }
    }
    render() {
        return (
            <WebView source={{uri: this.pubLishUrl}} onNavigationStateChange={(e) => {
                this.onNavigationStateChange(e)
            }}/>
        );
    }
    _onRefresh = () =>{};
    // render() {
    //     return (
    //
    //
    //     <ScrollableTabView>
    //         <FlatList style={{flex:1}}
    //                   tabLabel="一"
    //                   data={[{key: 'a'}, {key: 'b'},{key: 'c'}, {key: 'd'},{key: 'e'}, {key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'}, {key: 'j'}]}
    //                   renderItem={({item}) => <View style={{height:50,justifyContent:'center',alignItems:'center'}}><Text>{item.key}</Text></View>}
    //         />
    //         <FlatList style={{flex:1}}
    //                   tabLabel="二"
    //                   data={[{key: 'a'}, {key: 'b'},{key: 'c'}, {key: 'd'},{key: 'e'}, {key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'}, {key: 'j'}]}
    //                   renderItem={({item}) => <View style={{height:50,justifyContent:'center',alignItems:'center'}}><Text>{item.key}</Text></View>}
    //         />
    //         <FlatList style={{flex:1}}
    //                   tabLabel="三"
    //                   data={[{key: 'a'}, {key: 'b'},{key: 'c'}, {key: 'd'},{key: 'e'}, {key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'}, {key: 'j'}]}
    //                   renderItem={({item}) => <View style={{height:50,justifyContent:'center',alignItems:'center'}}><Text>{item.key}</Text></View>}
    //         />
    //         <FlatList style={{flex:1}}
    //                   tabLabel="四"
    //                   data={[{key: 'a'}, {key: 'b'},{key: 'c'}, {key: 'd'},{key: 'e'}, {key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'}, {key: 'j'}]}
    //                   renderItem={({item}) => <View style={{height:50,justifyContent:'center',alignItems:'center'}}><Text>{item.key}</Text></View>}
    //         />
    //         <FlatList style={{flex:1}}
    //                   tabLabel="五"
    //                   data={[{key: 'a'}, {key: 'b'},{key: 'c'}, {key: 'd'},{key: 'e'}, {key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'}, {key: 'j'}]}
    //                   renderItem={({item}) => <View style={{height:50,justifyContent:'center',alignItems:'center'}}><Text>{item.key}</Text></View>}
    //         />
    //         <FlatList style={{flex:1}}
    //                   tabLabel="六"
    //                   data={[{key: 'a'}, {key: 'b'},{key: 'c'}, {key: 'd'},{key: 'e'}, {key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'}, {key: 'j'}]}
    //                   renderItem={({item}) => <View style={{height:50,justifyContent:'center',alignItems:'center'}}><Text>{item.key}</Text></View>}
    //         />
    //         <FlatList style={{flex:1}}
    //                   tabLabel="七"
    //                   data={[{key: 'a'}, {key: 'b'},{key: 'c'}, {key: 'd'},{key: 'e'}, {key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'}, {key: 'j'}]}
    //                   renderItem={({item}) => <View style={{height:50,justifyContent:'center',alignItems:'center'}}><Text>{item.key}</Text></View>}
    //         />
    //         <FlatList style={{flex:1}}
    //                   tabLabel="八"
    //                   data={[{key: 'a'}, {key: 'b'},{key: 'c'}, {key: 'd'},{key: 'e'}, {key: 'f'},{key: 'g'}, {key: 'h'},{key: 'i'}, {key: 'j'}]}
    //                   renderItem={({item}) => <View style={{height:50,justifyContent:'center',alignItems:'center'}}><Text>{item.key}</Text></View>}
    //         />
    //
    //     </ScrollableTabView>
    //
    //     )
    // }
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






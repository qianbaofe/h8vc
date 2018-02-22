/**
 * Created by zhangzuohua on 2018/1/22.
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
    AppState
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Button from '../components/Button';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import {ifIphoneX} from '../utils/iphoneX';
import _fetch from  '../utils/_fetch'
import Home from './Home';
import storageKeys from '../utils/storageKeyValue'
import codePush from 'react-native-code-push'
import SplashScreen from 'react-native-splash-screen'
import RNFetchBlob from 'react-native-fetch-blob'
import Toast from 'react-native-root-toast';
import baseConfig from '../utils/baseConfig';
import * as WeChat from 'react-native-wechat';
//<View style={{...header}}>
export  default  class ScrollTabView extends Component {
    static navigationOptions = {
        header: ({navigation}) => {
            return (
                <ImageBackground style={{...header}} source={require('../assets/backgroundImageHeader.png')} resizeMode='cover'>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.routes[navigation.state.index].params.leftFuc && navigation.state.routes[navigation.state.index].params.leftFuc();
                    }}>
                        <View style={{justifyContent: 'center', marginLeft: 10, alignItems: 'center', height: 43.7}}>
                            <Image source={require('../assets/reload.png')} style={{width: 25, height: 25}}/>
                        </View>
                    </TouchableOpacity>
                    <Text style={{fontSize: 17, textAlign: 'center', lineHeight: 43.7, color: 'white', fontWeight:'100'}}>哈吧</Text>
                    <TouchableOpacity activeOpacity={1} onPress={() => {
                        navigation.state.routes[navigation.state.index].params.rightFuc && navigation.state.routes[navigation.state.index].params.rightFuc();
                    }}>
                        <View style={{justifyContent: 'center', marginRight: 10, alignItems: 'center', height: 43.7}}>
                            <Image source={require('../assets/edit.png')} style={{width: 30, height: 30}}/>
                        </View>
                    </TouchableOpacity>
                </ImageBackground>
            )
        }
    };
    //88  43.7 fontSize 17 fontWeight:600 RGBA0009 textALi;center
    constructor(props) {
        super(props);
        this.state = {
            sectionList: [],
            page: 0,
        };
    }

    readCache = () => {
        READ_CACHE("GesPWD", (res) => {
            if (res && res.length > 0) {
            } else {
            }

        }, (err) => {
        });

        WRITE_CACHE("USERPWD", {loginStatus: true}, null);
    }

    CodePushSync = () => {
        codePush.sync(
            {
                installMode: codePush.InstallMode.IMMEDIATE,
                updateDialog: {
                    appendReleaseDescription: true,
                    descriptionPrefix: '更新内容:',
                    mandatoryContinueButtonLabel: '更新',
                    mandatoryUpdateMessage: '有新版本了，请您及时更新',
                    optionalInstallButtonLabel: '立即更新',
                    optionalIgnoreButtonLabel: '稍后',
                    optionalUpdateMessage: '有新版本了，是否更新?',
                    title: '提示'
                },
            },
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this)
        );
    }

    componentWillMount() {
        //监听状态改变事件
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentDidMount() {
        if (Platform.OS === 'android'){
            NativeModules.NativeUtil.StatusBar();
        }
        SplashScreen.hide();
        this.CodePushSync();
        WeChat.registerApp('wxd750cac4fb66b983');
        this.props.navigation.setParams({
            rightFuc: () => {
                this.props.navigation.navigate('Web')
            },
            leftFuc: () => {
                DeviceEventEmitter.emit('reloadData')
            }
        });
        InteractionManager.runAfterInteractions(() => {
            this.loadData();
        });
    }

    componentWillUnmount() {
        //删除状态改变事件监听
        AppState.removeEventListener('change');
    }

    handleAppStateChange = (appState) => {
        console.log('当前状态为:' + appState);
        if (appState === 'active') {
            this.CodePushSync && this.CodePushSync();

        }
    }
    codePushDownloadDidProgress(progress) {

    }
    codePushStatusDidChange(syncStatus) {
        switch (syncStatus) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.log("Checking for update.");
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("Downloading package.");
                break;
            case codePush.SyncStatus.AWAITING_USER_ACTION:
                console.log('wait for user');
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                console.log('Installing update.');
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                console.log("App up to date.");
                break;
            case codePush.SyncStatus.UPDATE_IGNORED:
                console.log("Update cancelled by user.");
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                console.log('installed');
                break;
            case codePush.SyncStatus.UNKNOWN_ERROR:
                console.log('unknow error');
                break;
        }
    }
    loadData = () => {
        let url = urlConfig.baseURL + urlConfig.sectionList;
        RNFetchBlob.config({fileCache: true, ...baseConfig.BaseTimeOut}).fetch('GET', url, {
            ...baseConfig.BaseHeaders,
        }).then((res) => res.json()).then((responseJson) => {
            console.log("ZZZZ",responseJson);
            if ((responseJson.result instanceof Array) && responseJson.result.length > 0) {
                // responseJson.result.unshift({
                //     "classname": "最新",
                //     "classid": "new",
                //     "tbname": "article"
                // }, {
                //     "classname": "随机",
                //     "classid": "rand",
                //     "tbname": "article"
                // })
                WRITE_CACHE(storageKeys.sectionList, responseJson.result);
                this.setState({sectionList: responseJson.result});
            }
        }).catch((err) => {
            READ_CACHE(storageKeys.sectionList, (res) => {
                if (res && res.length > 0) {
                    this.setState({sectionList: res});
                } else {
                }
            }, (err) => {
            });
            Toast.show(err.message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: false,
                delay: 0
            });
        })
    }
        renderTab = (tabs) => {
            let array = [];
            array.push(tabs.map((item) => {
                return <Text style={{width: 50, height: 20}}>{item}</Text>
            }));
            return array;
        }
        renderTabBar = (params) => {
            global.activeTab = params.activeTab;
            this.state.sectionList.forEach((v, i) => {
                if (i === params.activeTab) {
                    global.activeClassId = v.classid
                }
            })

            return <ScrollableTabBar activeTextColor='red' underlineStyle={{height: 0,width:0}}
                                     backgroundColor='white' textStyle={{fontSize: 18, fontWeight:'100'}}
                                     tabStyle={{paddingLeft: 10, paddingRight: 10}} />;
        }
        pageNumber = (number) => {
            let page = 0;
            this.state.sectionList.forEach((v, i) => {
                if (parseInt(v.classid) === number) {
                    page = i
                }
            })
            this.setState({page: page});
        }

        renderContent = (sectionList) => {
            let list = [];
            list.push(sectionList.map((data, index) => {
                return <Home tabLabel={data.classname} data={data} {...this.props} pageNumber={(number) => {
                    this.pageNumber(number)
                }} index={index}/>
            }));
            return list;
        }

        render()
        {
            return (
                <View style={{flex: 1}}>
                    {Platform.OS === 'ios' ? <StatusBar barStyle="light-content"/> : null}
                    <ScrollableTabView renderTabBar={this.renderTabBar} page={this.state.page}>
                        {this.renderContent(this.state.sectionList)}
                    </ScrollableTabView>
                </View>
            );
        }
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








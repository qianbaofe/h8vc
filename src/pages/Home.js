/**
 * Created by zhangzuohua on 2018/1/22.
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
    Clipboard
} from 'react-native';
import urlConfig  from  '../../src/utils/urlConfig';
import ModalUtil from '../utils/modalUtil';
import formatData from '../../src/utils/formatData';
import Toast from 'react-native-root-toast';
import LoadError from  '../components/loadError';
import  _fetch from '../utils/_fetch'
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import PullList from '../components/pull/PullList'
import storageKeys from '../utils/storageKeyValue'
import * as WeChat from 'react-native-wechat';
export default class Home extends Component {
    static navigationOptions = {
    };
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            loadError:false,
            loadNewData:false,
            visible:false,
            ViewHeight:new Animated.Value(0)
        };
        //每次请求需要需要加pagenumber
        this.requestPageNumber = 0;

    }
    componentWillMount() {
     this._ViewHeight = new Animated.Value(0);
    }
    componentDidMount() {
        this.refTextArray = [];
        this.subscription = DeviceEventEmitter.addListener('reloadData', this.refreshing);

        InteractionManager.runAfterInteractions(() => {
            this.loadData();
        });
    }
    componentWillUnmount() {
        this.subscription.remove();
    }
     setClipboardContent = (text,index,item) => {
        try {
            let DeepCopyData = [].concat(JSON.parse(JSON.stringify(this.FlatListData)));
            DeepCopyData[index].isCopyed = true;
            this.flatList.setData(DeepCopyData);
            Clipboard.setString(item.smalltext && item.smalltext.replace(/^(\r\n)|(\n)|(\r)/,"") + "http://m.jianjie8.com/detail/" + item.classid + '/' + item.id);
            console.log('复制的文本',item.smalltext && item.smalltext.replace(/^(\r\n)|(\n)|(\r)/,"") + "http://m.jianjie8.com/detail/" + item.classid + '/' + item.id)
            Toast.show('复制成功', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        }catch (e){this.ToastShow(e.message)}
    }

    share = async()=>{
        let data = await NativeModules.NativeUtil.showDialog();
        if(data){
            WeChat.isWXAppInstalled().then((isInstalled) => {
                if (isInstalled) {
                    if (data.wechat === 1) {
                        WeChat.shareToSession({
                            title: "【哈吧笑话分享】",
                            description: this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                            type: 'news',
                            webpageUrl: "http://m.jianjie8.com/detail/" + this._shareItem.classid + '/' + this._shareItem.id,
                            thumbImage: 'http://h8.vc/skin/h8/images/icon_share.png'
                        }).then((message)=>{message.errCode === 0  ? this.ToastShow('分享成功') : this.ToastShow('分享失败')}).catch((error) => {
                            if (error.message != -2) {
                                Toast.show(error.message);
                            }
                        });
                    } else{
                        WeChat.shareToTimeline({
                            title: "【哈吧笑话分享】" + this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                            description: this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                            type: 'news',
                            webpageUrl: "http://m.jianjie8.com/detail/" + this._shareItem.classid + '/' + this._shareItem.id,
                            thumbImage: 'http://h8.vc/skin/h8/images/icon_share.png'
                        }).then((message)=>{message.errCode === 0  ? this.ToastShow('分享成功') : this.ToastShow('分享失败')}).catch((error) => {
                            if (error.message != -2) {
                                Toast.show(error.message);
                            }
                        });
                    }
                } else {
                    Toast.show("没有安装微信软件，请您安装微信之后再试");
                }
            });
            console.log('data',data)
        }
    }
    clickToShare = (type) => {
        this.close();
        WeChat.isWXAppInstalled().then((isInstalled) => {
            if (isInstalled) {
                if (type === 'Session') {
                        WeChat.shareToSession({
                            title: "【哈吧笑话分享】",
                            description: this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                            type: 'news',
                            webpageUrl: "http://m.jianjie8.com/detail/" + this._shareItem.classid + '/' + this._shareItem.id,
                            thumbImage: 'http://h8.vc/skin/h8/images/icon_share.png'
                        }).then((message)=>{message.errCode === 0  ? this.ToastShow('分享成功') : this.ToastShow('分享失败')}).catch((e)=>{if (error.message != -2) {
                            Toast.show(error.message);
                        }});
                    // WeChat.shareToSession({
                    //     title: "【哈吧笑话分享】",
                    //     description: this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                    //     type: 'news',
                    //     webpageUrl: "http://m.jianjie8.com/detail/" + this._shareItem.classid + '/' + this._shareItem.id,
                    //     thumbImage: 'http://h8.vc/skin/h8/images/icon_share.png'
                    // }).catch((error) => {
                    //     if (error.message != -2) {
                    //         Toast.show(error.message);
                    //     }
                    // });



                } else {
                    WeChat.shareToTimeline({
                        title: "【哈吧笑话分享】" + this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                        description: this._shareItem && this._shareItem.smalltext.replace(/^(\r\n)|(\n)|(\r)/,""),
                        type: 'news',
                        webpageUrl: "http://m.jianjie8.com/detail/" + this._shareItem.classid + '/' + this._shareItem.id,
                        thumbImage: 'http://h8.vc/skin/h8/images/icon_share.png'
                    }).then((message)=>{message.errCode === 0  ? this.ToastShow('分享成功') : this.ToastShow('分享失败')}).catch((error) => {
                        if (error.message != -2) {
                            Toast.show(error.message);
                        }
                    });
                }
            } else {
                //Toast.show("没有安装微信软件，请您安装微信之后再试");
            }
        });
    }
    renderSpinner = (text) => {
        return (
            <TouchableWithoutFeedback
                onPress={() => {this.setState({visible: false});}}>
                <View key="spinner" style={styles.spinner}>
                    <Animated.View style={{  justifyContent: 'center',
                        width:WIDTH,
                        height: this._ViewHeight,
                        backgroundColor: '#fcfcfc',
                        position:'absolute',
                        left:0,
                        right:0,
                        bottom:0,
                        overflow:'hidden'}}>
                        <View style={styles.shareParent}>
                            <TouchableOpacity
                                style={styles.base}
                                onPress={()=>this.clickToShare('Session')}
                            >
                                <View style={styles.shareContent}>
                                    <Image style={styles.shareIcon} source={require('../assets/share_icon_wechat.png')} />
                                    <Text style={styles.spinnerTitle}>微信好友</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.base}
                                onPress={()=>this.clickToShare('TimeLine')}
                            >
                                <View style={styles.shareContent}>
                                    <Image style={styles.shareIcon} source={require('../assets/share_icon_moments.png')} />
                                    <Text style={styles.spinnerTitle}>微信朋友圈</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{height:10,backgroundColor:'#f5f5f5'}}></View>
                        <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                            <Text style={{ fontSize: 16, color: 'black',textAlign: 'center' }}>取消</Text>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        );
    };
    show = (item)=>{
        if(Platform.OS==='android'){
            this.share()
            return;
        }
        this._ViewHeight.setValue(0);
        this._shareItem = item;
        this.setState({
            visible:true
        },  Animated.timing(this._ViewHeight, {
            fromValue:0,
            toValue: 140, // 目标值
            duration: 200, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start());
    };


    close = ()=>{
        this.setState({
            visible:false
        });
    };
    dealWithrequestPage = () =>{
      return  this.requestPageNumber > 0 ? '&page=' + this.requestPageNumber : ''
    }
    loadData = (resolve) => {
        let url = '';
        if (!this.props.data) {
            return;
        }
        switch (this.props.data.classid) {
            case '0':
               // url = urlConfig.baseURL + urlConfig.newList;
                url = urlConfig.baseURL + urlConfig.sectionListData + '&classid=' + this.props.data.classid + this.dealWithrequestPage();
                break;
            // case '1':
            //    // url =  this.isNotfirstFetch ? urlConfig.baseURL + urlConfig.randomList + '&num=' + '1' : urlConfig.baseURL + urlConfig.randomList;
            //     url = this.isNotfirstFetch ? urlConfig.baseURL + urlConfig.sectionListData + '&classid=' + this.props.data.classid + '&num=' + '1' : urlConfig.baseURL + urlConfig.sectionListData + '&classid=' + this.props.data.classid;
            //     break;
            default:
                url = this.isNotfirstFetch ? urlConfig.baseURL + urlConfig.sectionListData + '&classid=' + this.props.data.classid + '&num=' + '1'+ this.dealWithrequestPage():urlConfig.baseURL + urlConfig.sectionListData + '&classid=' + this.props.data.classid+ this.dealWithrequestPage();
        }
        console.log('url',url);
        _fetch(fetch(url),30000)
            .then((response) =>  response.json())
            .then((responseJson) => {
                console.log('XXX',responseJson,url);
                if (responseJson.status === '1') {
                    //每次请求的page加一
                    this.requestPageNumber += 1;
                    this.updateNumMessage = responseJson.updateNum;
                    if (this.updateNumMessage && this.isNotfirstFetch) {  setTimeout(() => {
                        this.setState({loadNewData: true})
                    }, 500)};
                    console.log('xxxxxx',responseJson.result);
                    this.flatList && this.flatList.setData(this.dealWithLongArray(responseJson.result), 0);
                    this.FlatListData = this.dealWithLongArray(responseJson.result);
                    console.log('xxxxxx1',this.FlatListData);
                    resolve &&  resolve();
                    WRITE_CACHE(storageKeys.homeList + 'page' + this.props.index,responseJson.result);
                    setTimeout(() => {
                        this.setState({loadNewData: false})
                    }, 1500)
                    //要求除了最新外其他页面非第一次接口请求都要加上&num
                    if (this.props.index !== 0){ this.isNotfirstFetch = true};
                }else{
                    READ_CACHE(storageKeys.homeList + 'page' + this.props.index,(res)=>{
                        if (res && res.length > 0) {
                            this.flatList && this.flatList.setData(res, 0);
                        }else{}
                    },(err)=>{
                    });
                    Toast.show(responseJson.message, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.CENTER,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                }
            })
            .catch((error) => {
                READ_CACHE(storageKeys.homeList + 'page' + this.props.index,(res)=>{
                    if (res && res.length > 0) {
                        this.flatList && this.flatList.setData(res, 0);
                    }else{}
                },(err)=>{
                });
                Toast.show(error.message, {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                });
            });
    }
    dealWithLongArray = (dataArray) => {
       // let waitDealArray = this.state.data.concat(dataArray);
        let waitDealArray = dataArray.concat(this.FlatListData).filter((value)=>{return !(!value || value === "");});
        if (waitDealArray.length >= 50) {
            waitDealArray = waitDealArray.slice(0, 50);
            console.log('处理过的array', waitDealArray);
        }
        return waitDealArray;
    }
    dealWithLoadMoreData = (dataArray) => {
        // let waitDealArray = this.state.data.concat(dataArray);
        console.log('loadMoreData',dataArray);
        let waitDealArray =this.FlatListData.concat(dataArray).filter((value)=>{return !(!value || value === "");});
        console.log('loadMoreDatacontact',waitDealArray);
        if (waitDealArray.length >= 50) {
            waitDealArray = waitDealArray.slice(waitDealArray.length -50, waitDealArray.length);
            console.log('处理过的array', waitDealArray);
        }
        return waitDealArray;
    }
    refreshing = () => {
        if (this.props.index === global.activeTab){
            this.flatList.scrollToOffset({ offset: 0, animated: true });
            this.flatList.BeginRefresh();
            //this.loadData()
           // setTimeout(this.flatList.StopRefresh,1000);
         //   this.flatList.StopRefresh();
            //this.flatList.scrollToIndex({animated: true,index :2});
           // this.setState({refreshing: true});
        }
    }
    ToastShow = (message) => {
        Toast.show(message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
    }
    PostThumb = (item,dotop,index) => {
        //diggtop   //diggbot
      //  {classid:2,id:2,dotop:1,doajax:1,ajaxarea:'diggnum'dotop这个字段 传0 是踩 传1是赞}
        try {
            let upDownData = [].concat(JSON.parse(JSON.stringify(this.FlatListData)));
            if (dotop === 0) {
                upDownData[index].isUnLike = true;
                upDownData[index].diggbot = (parseInt(upDownData[index].diggbot) - 1).toString();

            }
            if (dotop === 1) {
                upDownData[index].isLike = true;
                upDownData[index].diggtop = (parseInt(upDownData[index].diggtop) + 1).toString();
            }

            let url = '';
            if (dotop === 0) {
                url = urlConfig.baseURL + urlConfig.thumbDownUrl;
            } else if (dotop === 1) {
                url = urlConfig.baseURL + urlConfig.thumbUpUrl;
            }
            //不用formdate后台解析不出来
            let formData = new FormData();
            formData.append("id", item.id);
            formData.append("classid", item.classid);
            formData.append("dotop", '' + dotop);
            formData.append("doajax", '' + 1);
            formData.append("ajaxarea", "diggnum");

            fetch(url, {
                method: 'POST',
                headers: {},
                body: formData
            }).then((respond) => {
                console.log('XXX', respond._bodyInit);
                let message = '';
                let array = respond._bodyInit.split('|');
                if (array.length > 0) {
                    message = array[array.length - 1];
                }
                if (message === '谢谢您的支持' || message === '谢谢您的意见') {
                    this.flatList.setData(upDownData);
                    //只能操作数据源修改列表数据  很大的损耗啊
                    this.FlatListData = upDownData;
                }
                this.ToastShow(message);
            }).catch((error) => {
                this.ToastShow('失败');
                throw error;
            });
        }catch (e){ this.ToastShow(e.message);}

    }
  //ref={(c) => {this.refTextArray.push(c)}}
//<Text style={{color: '#D3D3D3', marginLeft: 10}}>{formatData(item.newstime)}</Text>
   // item.smalltext && item.smalltext.replace(/\s+/g, "")
    _renderItem = ({item, index}) => {
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {
                {/*this.refTextArray[index].setNativeProps({*/}
                    {/*style: {color: '#D3D3D3'}*/}
                {/*});*/}
               // this.props.navigation.navigate('Detail', {data: this.state.data[index]});
               // /^\r+|\n+$/g
               // .replace(/^(\r\n)|(\n)|(\r)$/g,"")

            }}>
                <View>
                    <View style={{backgroundColor: 'white',marginHorizontal:15,marginTop:15}}>
                        <Text style={{
                            fontSize: 16,
                            lineHeight: 24,
                            color:item.isCopyed ? '#666666' : 'black',
                            fontWeight:'100'
                        }}>{item.smalltext && item.smalltext.replace(/^(\r\n)|(\n)|(\r)/,"")}</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 15,
                                marginBottom:15,
                                justifyContent: 'space-between',
                            }}>
                            <View style={{flexDirection: 'row'}}>
                                {(this.props.data.classid === '0' || this.props.data.classid === '1') ? <View style={{flexDirection: 'row'}}><Text style={{
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    borderWidth: 1,
                                    borderRadius: 10,
                                    fontWeight:'100',
                                    borderColor:'#eee'
                                }} onPress={() => {
                                    this.props.pageNumber(parseInt(item.classid))
                                }}>{item.classname && item.classname}</Text><Text style={{marginLeft:10,paddingVertical: 2,color:'#999999',fontWeight:'100'}}>{"" + item.id}</Text></View> : <View><Text style={{paddingVertical: 2,color:'#999999',fontWeight:'100'}}>{"" + item.id}</Text></View>}</View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={()=>{this.setClipboardContent(item.smalltext && item.smalltext,index,item)}} hitSlop={{left:10,right:10,top:10,bottom:10}}>
                                        <Image style={{width: 20, height: 20}} source={item.isCopyed ? require('../assets/copyRed.jpg') : require('../assets/copy.jpg')}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flexDirection: 'row',marginLeft: 10}}>
                                    <TouchableOpacity activeOpacity={1} onPress={()=>{this.PostThumb(item,1,index)}} hitSlop={{left:10,right:10,top:10,bottom:10}}>
                                        <Image style={{width: 20, height: 20}} source={item.isLike ?require('../assets/upRed.jpg') : require('../assets/up.jpg')}/>
                                    </TouchableOpacity>
                                    <Text style={{marginLeft: 5,fontWeight:'100'}}>{item.diggtop && item.diggtop}</Text>
                                </View>
                                <View style={{flexDirection: 'row', marginLeft: 10}}>
                                    <TouchableOpacity activeOpacity={1} onPress={()=>{this.PostThumb(item,0,index)}} hitSlop={{left:10,right:10,top:10,bottom:10}}>
                                        <Image style={{width: 20, height: 20}} source={item.isUnLike ? require('../assets/downRed.jpg') : require('../assets/down.jpg')}/>
                                    </TouchableOpacity>
                                    <Text style={{marginLeft: 5,fontWeight:'100'}}>{item.diggbot && item.diggbot}</Text>
                                </View>
                                <View style={{flexDirection: 'row', marginLeft: 10}}>
                                    <TouchableOpacity activeOpacity={1} onPress={()=> { this.show(item)}} hitSlop={{left:10,right:10,top:10,bottom:10}}>
                                        <Image style={{width: 20, height: 20}} source={require('../assets/share.jpg')}/>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#eee'}}></View>
                </View>
            </TouchableOpacity>
        )
    }

// <PullList
// type = "wait"
// style={{height:HEIGHT-SCALE(94)}}
// ref={(list)=> this.ultimateListView = list}
// onPullRelease={this.onPullRelease}
// onEndReached={this.loadMore}
// renderItem={this.renderRowView}
// numColumns={1}
// initialNumToRender={5}
// key={'list'}
// />
    onPullRelease = async (resolve) => {
        this.loadData(resolve);
    };
    loadMore = async()=>{
        // if (this.props.index !== 1) {
        //     return;
        // }

        let url = '';
        if (!this.props.data) {
            return;
        }
        switch (this.props.data.classid) {
            case '0':
                url = urlConfig.baseURL + urlConfig.sectionListData + '&classid=' + this.props.data.classid + this.dealWithrequestPage();
                break;
            default:
                url = this.isNotfirstFetch ? urlConfig.baseURL + urlConfig.sectionListData + '&classid=' + this.props.data.classid + '&num=' + '1'+ this.dealWithrequestPage():urlConfig.baseURL + urlConfig.sectionListData + '&classid=' + this.props.data.classid+ this.dealWithrequestPage();

        }
        _fetch(fetch(url),30000)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('XXX',responseJson,url);
                if (responseJson.status === '1') {
                    this.requestPageNumber += 1;
                    this.flatList && this.flatList.addData(this.dealWithLoadMoreData(responseJson.result));
                    this.FlatListData = this.dealWithLoadMoreData(responseJson.result);
                }else{
                    Toast.show(responseJson.message, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.CENTER,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                }
            })
            .catch((error) => {
                Toast.show(error.message, {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                });
            });

    };
//     //   <PullList
//     //  data={this.state.data}
//     keyExtractor={this._keyExtractor}
// onPullRelease={this.onPullRelease}
// renderItem={this._renderItem}
// onEndReached={this.loadMore}
// style={{backgroundColor: 'white'}}
// ref={(c) => {this.flatList = c}}
// ifRenderFooter={this.props.index !== 1 ? false : true}
//
// />
    _keyExtractor = (item, index) => index;
    render() {
        return (
            <View style={{flex: 1}} >
                <PullList
                  //  data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    onPullRelease={this.onPullRelease}
                    renderItem={this._renderItem}
                    onEndReached={this.loadMore}
                    style={{backgroundColor: 'white'}}
                    ref={(c) => {this.flatList = c}}
                    ifRenderFooter={true}
                />
                {this.state.loadNewData ? <View style={{
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#C9E4F7',
                    position:'absolute',
                    left:0,
                    right:0,
                    top:0
                }}>
                    <Text style={{color: '#4884BE'}}>{this.updateNumMessage}</Text>
                </View> : <View/>}
                <ModalUtil
                    visible = {this.state.visible}
                    close = {this.close}
                    contentView = {this.renderSpinner}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    base: {
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFF'
    },
    spinner: {
        width: WIDTH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)'
    },
    spinnerContent: {
        justifyContent: 'center',
        width: WIDTH,
        backgroundColor: '#fcfcfc',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    spinnerTitle: {
        fontSize: 14,
        color: '#313131',
        textAlign: 'center',
        marginTop: 5
    },
    shareParent: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    shareContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shareIcon: {
        width: 40,
        height: 40
    }
});
/**
 * Created by zhangzuohua on 2018/1/22.
 */
export default urlConfig = {
    baseURL: 'http://jianjie.92kaifa.com',
    //最新更新
    newList: '/e/api/?getJson=new',
   // 随机穿越
    randomList: '/e/api/?getJson=rand',
   //待处理
   //栏目列表 http://jianjie.92kaifa.com/e/api/getNewsClass.php
    sectionList:'/e/api/?getJson=class',
    //栏目列表数据后面拼接&classid=3
    sectionListData:'/e/api/?getJson=column',
    //发布地址
    pubLishUrl:'http://m.h8.vc/fromapp',

    //点赞或者踩 {classid:2,id:2,dotop:1,doajax:1,ajaxarea:'diggnum'dotop这个字段 传0 是踩踩 传1是赞}
    thumbUpUrl:'/e/public/digg/post/index.php',

    thumbDownUrl:'/e/public/digg/post/diggbot.php',
}
//http://h8.vc/e/api/?getJson=
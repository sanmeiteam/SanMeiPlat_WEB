/*
 * 计算灵龟八法开穴的算法
 * 李智敏设计
 */
/////////////////自定义内容
var lunarInfo=new Array(
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0)
var Gan=new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸");
var Zhi=new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥");
var now = new Date();
var SY = now.getFullYear();
var SM = now.getMonth();
var SD = now.getDate();
var SH = now.getHours();
//==== 传入 offset 传回干支, 0=甲子
function cyclical(num) { return(Gan[num%10]+Zhi[num%12])}
function dayGan(num) { return(Gan[num%10])}
function dayZhi(num) { return(Zhi[num%12])}
//==== 传回农历 y年的总天数
function lYearDays(y) {
  var i, sum = 348
  for(i=0x8000; i>0x8; i>>=1) sum += (lunarInfo[y-1900] & i)? 1: 0
  return(sum+leapDays(y))
}
//==== 传回农历 y年闰月的天数
function leapDays(y) {
  if(leapMonth(y))    return((lunarInfo[y-1900] & 0x10000)? 30: 29)
  else return(0)
}
//==== 传回农历 y年闰哪个月 1-12 , 没闰传回 0
function leapMonth(y) { return(lunarInfo[y-1900] & 0xf)}
//====================================== 传回农历 y年m月的总天数
function monthDays(y,m) { return( (lunarInfo[y-1900] & (0x10000>>m))? 30: 29 )}
//==== 算出农历, 传入日期物件, 传回农历日期物件
//       该物件属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
function Lunar(objDate) {
  var i, leap=0, temp=0
  var baseDate = new Date(1900,0,31)
  var offset     = (objDate - baseDate)/86400000
  this.dayCyl = offset + 40
  this.monCyl = 14
  for(i=1900; i<2050 && offset>0; i++) {
    temp = lYearDays(i)
    offset -= temp
    this.monCyl += 12
  }
  if(offset<0) {
    offset += temp;
    i--;
    this.monCyl -= 12
  }
  this.year = i
  this.yearCyl = i-1864
  leap = leapMonth(i) //闰哪个月
  this.isLeap = false
  for(i=1; i<13 && offset>0; i++) {
    //闰月
    if(leap>0 && i==(leap+1) && this.isLeap==false)
    { --i; this.isLeap = true; temp = leapDays(this.year); }
    else
    { temp = monthDays(this.year, i); }
    //解除闰月
    if(this.isLeap==true && i==(leap+1)) this.isLeap = false
    offset -= temp
    if(this.isLeap == false) this.monCyl ++
  }
  if(offset==0 && leap>0 && i==leap+1)
    if(this.isLeap)
    { this.isLeap = false; }
    else
    { this.isLeap = true; --i; --this.monCyl;}
  if(offset<0){ offset += temp; --i; --this.monCyl; }
  this.month = i
  this.day = offset + 1
}
function getCurDate(now){

  var day = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
  var hour;
  if (now.getHours()<10)
  {
    hour='0'+now.getHours();
  }
  else {
    hour=now.getHours();
  }
  var min;
  if (now.getMinutes()<10)
  {
    min='0'+now.getMinutes();
  }
  else {
    min=now.getMinutes();
  }
  var sec;
  if (now.getSeconds()<10)
  {
    sec='0'+now.getSeconds();
  }
  else {
    sec=now.getSeconds();
  }
  var rtnstr=SY+'-'+(SM+1)+'-'+SD+ '&nbsp;&nbsp;'+ day[now.getDay()]+'&nbsp;&nbsp;';
  rtnstr+=hour+':'+min+':'+sec;
  //alert(rtnstr);
  return rtnstr;
}

// 日干支 代数
function dayNum(ganzhi)
{
  if (ganzhi=="甲" || ganzhi=="己" || ganzhi=="辰" || ganzhi=="戌" || ganzhi=="丑" || ganzhi=="未") {return(10);}
  if (ganzhi=="乙" || ganzhi=="庚" || ganzhi=="申" || ganzhi=="酉") {return(9);}
  if (ganzhi=="丁" || ganzhi=="壬" || ganzhi=="寅" || ganzhi=="卯") {return(8);}
  if (ganzhi=="戊" || ganzhi=="癸" || ganzhi=="巳" || ganzhi=="午") {return(7);}
  if (ganzhi=="丙" || ganzhi=="辛" || ganzhi=="亥" || ganzhi=="子") {return(7);}
}
// 时干支 代数
function hourNum(ganzhi)
{
  if (ganzhi=="甲" || ganzhi=="己" || ganzhi=="子" || ganzhi=="午") {return(9);}
  if (ganzhi=="乙" || ganzhi=="庚" || ganzhi=="丑" || ganzhi=="未") {return(8);}
  if (ganzhi=="丙" || ganzhi=="辛" || ganzhi=="寅" || ganzhi=="申") {return(7);}
  if (ganzhi=="丁" || ganzhi=="壬" || ganzhi=="卯" || ganzhi=="酉") {return(6);}
  if (ganzhi=="戊" || ganzhi=="癸" || ganzhi=="辰" || ganzhi=="戌") {return(5);}
  if (ganzhi=="巳" || ganzhi=="亥" ) {return(4);}
}
// 日干数
function dayNum2(ganzhi)
{
  if (ganzhi=="甲") {return(1);}
  if (ganzhi=="乙") {return(2);}
  if (ganzhi=="丙") {return(3);}
  if (ganzhi=="丁") {return(4);}
  if (ganzhi=="戊") {return(5);}
  if (ganzhi=="己") {return(6);}
  if (ganzhi=="庚") {return(7);}
  if (ganzhi=="辛") {return(8);}
  if (ganzhi=="壬") {return(9);}
  if (ganzhi=="癸") {return(10);}
}
//时数
function hourNum2()
{
  if (SH>=23 || SH<1) {return(1);}
  if (SH>=1 && SH<3) {return(2);}
  if (SH>=3 && SH<5) {return(3);}
  if (SH>=5 && SH<7) {return(4);}
  if (SH>=7 && SH<9) {return(5);}
  if (SH>=9 && SH<11) {return(6);}
  if (SH>=11 && SH<13) {return(7);}
  if (SH>=13 && SH<15) {return(8);}
  if (SH>=15 && SH<17) {return(9);}
  if (SH>=17 && SH<19) {return(10);}
  if (SH>=19 && SH<21) {return(11);}
  if (SH>=21 && SH<23) {return(12);}
}
function quxue(finalNum)
{
  if (finalNum==1) {return("申脉-后溪");}
  if (finalNum==2) {return("照海-列缺");}
  if (finalNum==3) {return("外关-足临泣");}
  if (finalNum==4) {return("足临泣-外关");}
  if (finalNum==5) {return("<font style='color:blue;'>男：照海-列缺</font></br><font style='color:red'>女：内关-公孙</font>");}
  if (finalNum==6) {return("公孙-内关");}
  if (finalNum==7) {return("后溪-申脉");}
  if (finalNum==8) {return("内关-公孙");}
  if (finalNum==9) {return("列缺-照海");}
}
function quxue1(finalNum)
{
  if (finalNum==1) {return("申脉-后溪");}
  if (finalNum==2) {return("照海-列缺");}
  if (finalNum==3) {return("外关-足临泣");}
  if (finalNum==4) {return("足临泣-外关");}
  if (finalNum==5) {return("<font style='color:blue;'>男：照海-列缺</font></br><font style='color:red'>女：内关-公孙</font>");}
  if (finalNum==6) {return("公孙-内关");}
  if (finalNum==7) {return("后溪-申脉");}
  if (finalNum==8) {return("内关-公孙");}
  if (finalNum==9) {return("列缺-照海");}
}
var sDObj = new Date(SY,SM,SD);
var lDObj = new Lunar(sDObj);
var daynum=parseInt(lDObj.dayCyl++); //日数
var curday = daynum; //计算当前开穴用
var curdaylist = daynum; //计算开穴列表用
////计算数据处理 =============


function solarDay1(flag,now){
  SY = now.getFullYear();
  SM = now.getMonth();
  SD = now.getDate();
  SH = now.getHours();
  if (flag == 1)
  {
    if (SH>=21 && SH<=23)
    {
      SH = SH + 2;
      curday= daynum+1 ;
    }
    else
    {
      SH = SH + 2;
    }
  }
  else
  {
    if (SH==23)
    {
      curday= daynum+1 ;
    }
  }

  if (SH>=24)
  {
    SH = SH - 24;
  }
  //日干x2+时支数-2=时干数
  var rigan = dayGan(curday);//日干
  var rizhi = dayZhi(curday);//日支
  var tmpshigan=dayNum2(rigan)*2+hourNum2()-2;

  var shigan = Gan[tmpshigan % 10-1];//时干
  if (tmpshigan%10>0)
  {
    shigan=Gan[tmpshigan % 10-1];
  }
  else {
    shigan=Gan[9];
  }

  var shizhi = Zhi[hourNum2()-1];//时支

  var riganNum = dayNum(rigan);//日干代数
  var rizhiNum = dayNum(rizhi);//日支代数
  var shiganNum = hourNum(shigan);//时干代数
  var shizhiNum = hourNum(shizhi);//时支代数
  var finalNum=0;//取穴数字
  if(curday % 2 == 0) { //阳
    finalNum=(riganNum+rizhiNum+shiganNum+shizhiNum)%9;
    if (finalNum==0) {finalNum=9;}
  }
  else //阴
  {
    finalNum=(riganNum+rizhiNum+shiganNum+shizhiNum)%6;
    if (finalNum==0) {finalNum=6;}
  };
  if (flag == 1)
  {
    if (SH==23 || SH==0)
    {
      curday= daynum;
    }
    var rr = '<span STYLE="font-size:20pt;color:black;font-weight:bold;">下次开穴('+ shigan + shizhi+')-' +finalNum+'：</br></span>';
    rr = rr + '<div STYLE="font-size:24pt;color:#008800;font-weight:bold;width:100%;text-align:left;padding-left:40px;">'+quxue(finalNum)+'</br></div>';
    return(rr);
  }
  else
  {
    if (SH==23)
    {
      curday= daynum;
    }
    var tt = '<span STYLE="font-size:20pt;color:#0066aa;">';
    tt = tt + cyclical(SY-1900+36)+'年&nbsp;&nbsp;'+rigan+rizhi+'日&nbsp;&nbsp;'+shigan + shizhi +'时 </span></br>';
    tt = tt + '<span STYLE="font-size:20pt;color:black;font-weight:bold;">当前开穴('+ shigan + shizhi+')-'+finalNum+'：</br></span>';
    tt = tt + '<div STYLE="font-size:32pt;color:#008800;font-weight:bold;width:100%;text-align:left;padding-left:40px;">'+quxue(finalNum)+'</br></div>';
    return(tt);
  }
}

// 按日查询
var nowlist = new Date();
var ddate=nowlist.getDate();
function queryDay(i){
  ddate=nowlist.getDate()
  //日干x2+时支数-2=时干数
  curdaylist = curdaylist + i;
  var rigan = dayGan(curdaylist);//日干
  var rizhi = dayZhi(curdaylist);//日支
  ddate = ddate + i;
  nowlist.setDate(ddate);
  document.getElementById("tday").innerHTML=nowlist.getFullYear()+'-'+(nowlist.getMonth()+1)+'-'+nowlist.getDate()+'('+rigan+rizhi+'日)';
  var yy='<table cellpadding=0 cellspacing=0 border=1 style="border-collapse:collapse;">';
  yy = yy +'<tr class="tabtr"><td>时辰</td><td>时间</td><td>数字</td><td>开穴</td></tr>';
  for (var j=0;j<=22;j=j+2)
  {
    SH = j;
    var tmpshigan=dayNum2(rigan)*2+hourNum2()-2;
    var shigan = Gan[tmpshigan % 10-1];//时干
    if (tmpshigan%10>0)
    {
      shigan=Gan[tmpshigan % 10-1];
    }
    else {
      shigan=Gan[9];
    }
    var shizhi = Zhi[hourNum2()-1];//时支

    var riganNum = dayNum(rigan);//日干代数
    var rizhiNum = dayNum(rizhi);//日支代数
    var shiganNum = hourNum(shigan);//时干代数
    var shizhiNum = hourNum(shizhi);//时支代数

    var finalNum=0;//取穴数字
    if(curdaylist % 2 == 0) { //阳
      finalNum=(riganNum+rizhiNum+shiganNum+shizhiNum)%9;
      if (finalNum==0) {finalNum=9;}
    }
    else //阴
    {
      finalNum=(riganNum+rizhiNum+shiganNum+shizhiNum)%6;
      if (finalNum==0) {finalNum=6;}
    };
    var tSH;
    if (SH-1==-1)
    {
      tSH=23;
    }
    else
    {
      tSH= SH - 1;
    }
    yy = yy + '<tr class="tabtr2"><td width="20%">'+shigan + shizhi +'</td><td width="30%">'+tSH+':00~'+(SH+1)+':00</td>';
    yy = yy + '<td width="20%">'+finalNum+'</td><td width="30%">'+quxue1(finalNum)+'</td></tr>';

  }
  yy = yy + '</table>';

  document.getElementById("dayq").innerHTML=yy;

}
export { //很关键
  getCurDate,
  solarDay1,
  queryDay
}

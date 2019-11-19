<template>
  <div class="login-container">
    <div id="result"></div>
    <div id="curdate" style="display:block;">2018-11-16 星期五 16:50</div>
    <div id="con" style="display:block;"></div>
    <div id="nextCon" style="display:block;"></div>
    <div id="dayt">
      <table cellpadding=0 cellspacing=0 style="border-collapse:collapse;width:100%;background-color:gray;">
        <tr style="background-color:#cccccc;height:25px;">
          <td id="pday">
            <input class='dayButton' type="button" value="前一天" @click="queryDay2(-1)" />
          </td>
          <td id="tday"></td>
          <td id="nday"><input class='dayButton' type="button" value="后一天" @click="queryDay2(1)" /></td>
        </tr>
      </table>
    </div>
    <div id="dayq"></div>
  </div>

</template>

const ColProps = {
xs: 24,
sm: 12,
lg: 6,
style: {
marginBottom: 5,
},
}

<script>
  import {getCurDate,solarDay1,queryDay} from './cal.js'
  export default {
    name: 'login',
    data() {
      return {
        timer: ''
      }
    },
    created() {
    },
    computed: {
    },
    methods: {
      loopSetTime()
      {
        let now = new Date();
        //显示当前日期
        //alert(getCurDate());
        document.getElementById("curdate").innerHTML=getCurDate(now);
        // 当前时辰开穴
        document.getElementById("con").innerHTML=""+solarDay1(0,now);
        // 下一时辰开穴
        document.getElementById("nextCon").innerHTML=solarDay1(1,now);
      },
      queryDay2(i){
        queryDay(i);
      }

    },
    mounted(){
      //初次显示开穴
      this.loopSetTime();
      //启动定时器，定时刷新时间，开穴
      this.timer = setInterval(this.loopSetTime, 1000);
      //显示开穴表格
      queryDay(0);
    }
  }

</script>
<style rel="stylesheet/scss" lang="scss">
  label {
    margin: 10px;
    font-size: 24px;
  }

  ul {
    margin-bottom: 10px;
  }

  ul li {
    margin: 5px 10px;
    padding: 5px;
    color: #000;
    word-wrap: break-word;
  }

  #dayq {
    width:100%;
  }
  #dayq table {
    width:100%;
  }
  .tabtr2 td
  {
    height:25px;
    font-size:13px;
    color:#000088;
    text-align:center;
  }
  .tabtr td {
    color:#008800;
    font-weight:bold;
    height:25px;
    font-size:13px;
    text-align:center;
  }
  #pday{
    text-align:right;
    width:25%;
    cursor:hand;
  }
  #tday{
    text-align:center;
    width:50%;
  }
  #nday{
    text-align:left;
    width:25%;
    cursor:hand;
  }
  #curdate{
    width:100%;
    height:30px;
    border:solid 0px gray;
    color:#000;
    font-size:25px;
    padding-top:5px;
  }
  .dayButton
  {
    text-decoration: underline;
    color:#0088ff;
  }

</style>

  function formatTime(datetime){
      var fullyear = datetime.getFullYear();
      var month =  datetime.getMonth() +1;
      var day =  datetime.getDate();
      var hour =  datetime.getHours();
      var minute =  datetime.getMinutes();
      //存储各种时间格式，方便以后扩展
      var createtime = {
          date: datetime,
          time:  (hour< 10 ? '0' + hour: hour) + ":" + (minute< 10 ? '0' + minute : minute),
          year : fullyear,
          month : fullyear + "-" + month,
          day : fullyear+ "-" + (month< 10 ? '0' + month: month) + "-" + (day< 10 ? '0' + day : day),
          minute : fullyear + "-" + month+ "-" + day + " " + 
          (hour< 10 ? '0' + hour: hour) + ":" + (minute< 10 ? '0' + minute : minute)
      }
      return createtime;
  }

  module.exports = formatTime;
window.onload = () => {

  class Weather {
    query(Element) {
      return document.querySelector(Element)
    }

    queryAll(Element) {
      return document.querySelectorAll(Element)
    }

    AddEvent(type, Element, fn) {
      let element = document.querySelectorAll(Element);

      for (let i = 0; i < element.length; i++) {
        return element[i]['on' + type] = fn
      }
    }

    Get(o) {

      let promise = new Promise(function (resolve, reject) {

        // 创建ajax对象
        let xhr = null;
        xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {

          // 监听状态码
          if (this.readyState === 4 && this.status === 200) {

            let data = this.responseText;
            resolve(JSON.parse(data))

          }
        }
        let str = ''
        for (let k in o.parameter) {
          str += [k] + "=" + o.parameter[k] + '&';
        }
        let parameter = str.slice(0, -1);

        // 创建连接
        xhr.open(o.type, '' + o.url + '?' + parameter + '', o.isAsync)

        // 发送请求
        xhr.send('')

      })

      return promise;

    }

    // 当前位置
    JSONP(o) {

      return new Promise((resolve, reject) => {

        let fnName = 'jsonp' + new Date().getTime();
        // 回调函数
        window[fnName] = resolve;

        let script = document.createElement('script');

        // 处理数据
        let params = '';
        for (let k in o.data) {
          params += k + '=' + o.data[k] + '&';
        }
        params = params + o.callback + '=' + fnName;

        script.src = o.url + '?' + params;

        document.body.appendChild(script)

        setTimeout(() => {
          script.remove();
          delete window[fnName]
        }, 800)

      })

    }

    // 初始化实时天气
    Initialize(city) {
      var self = this;
      // 实时天气
      this.Get({
        type: 'GET',
        url: 'https://api.heweather.net/s6/weather/now',
        isAsync: true,
        parameter: {
          location: city,
          key: '843f111a3c464644ae2f75e8965a32f5'
        }
      }).then(value => {
        // 获取元素
        // 城市
        let cities = self.query('.location>.city');
        // 实时温度
        let realTime = self.query('.temp>.realTime');
        // 实时天气状态
        let realTime_text = self.query('.temp .cond_txt');
        // 实时风向
        let realTime_dir = self.query('.temp .wind_dir');
        // 今日天气
        let today_weather = self.query('.today-weather');
        // 实时天气图标
        let weather_icon = self.query('.today-weather img')

        let v = value.HeWeather6;
        
        for (let i = 0; i < v.length; i++) {
          var city = v[i].basic.location;
          // 实况天气状态码
          var cond_code = v[i].now.cond_code;
          // 实时天气状态
          var cond_txt = v[i].now.cond_txt;
          // 实时风向
          var wind_dir = v[i].now.wind_dir;
          // 实时温度
          var tmp = v[i].now.tmp
        }
        // 城市
        cities.innerHTML = city;
        // 状态码
        today_weather.setAttribute('code', cond_code);
        // 实时温度
        realTime.innerHTML = tmp + '°C';
        // 实时天气状态
        realTime_text.innerHTML = cond_txt;
        // 实时风向
        realTime_dir.innerHTML = wind_dir;
        // 设置实时图标
        weather_icon.src = './images/' + cond_code + '.png'
      })

    }

    // 初始化周天气
    InitWeek(city) {

      let week = ['日', '一', '二', '三', '四', '五', '六']

      // 获取元素
      let week_date = this.query('.week-date');

      week_date.innerHTML = '';

      let ul = document.createElement('ul');

      let nowMonth = new Date().getMonth() + 1;
      let nowDay = new Date().getDay();
      let nowDate = new Date().getDate();

      nowMonth = nowMonth >= 10 ? nowMonth : '0' + nowMonth;
      nowDate = nowDate >= 10 ? nowDate : '0' + nowDate;

      let dateStr = nowMonth + '-' + nowDate;

      // 实时天气
      this.Get({
        type: 'GET',
        url: 'https://api.heweather.net/s6/weather/forecast',
        isAsync: true,
        parameter: {
          location: city,
          key: '843f111a3c464644ae2f75e8965a32f5'
        }
      }).then(value => {
        let v = value.HeWeather6;
        for (let i = 0; i < v.length; i++) {

          var weekData = v[i].daily_forecast.slice(0, 5);

          for (let j = 0; j < weekData.length; j++) {
            ++nowDay;
            nowDay = nowDay >= 8 ? 1 : nowDay;
            var li = document.createElement('li');

            li.setAttribute('code', weekData[j].cond_code_d);

            let day = weekData[j].date.slice(5);

            li.innerHTML = `<div class="weekT">
            <p class="weekDay">${dateStr == day?'今天':'周'+week[nowDay-1]}</p>
            <a class="date">${day}</a>
            <p class="img"><img class="auto-img" src="./images/${weekData[j].cond_code_d}.png"></p>
            <p class="maxT">${weekData[j].tmp_max}°C</p>
            <p class="minT">${weekData[j].tmp_min}°C</p>
          </div>`;

            ul.appendChild(li)
          }
        }

        week_date.appendChild(ul)
      })

    }
    // 根据时间段变换背景
    alterBg() {

      let weatherBox = this.query('.weatherBox');

      let now = new Date().getHours();
      if (now > 6 && now <= 10) {
        weatherBox.style.background = 'url("./images/qing.png") no-repeat';

      } else if (now > 10 && now <= 17) {
        weatherBox.style.background = 'url("./images/bg.jpg") no-repeat';
      } else if (now > 17 && now <= 19) {
        weatherBox.style.background = 'url("./images/ye.png") no-repeat';
      } else {
        weatherBox.style.background = 'url("./images/yeqing.png") no-repeat';
      }

      weatherBox.style.backgroundSize = '100% 45%';
    }

    // 生活指数
    liveStyle(city) {
      this.Get({
        type: 'GET',
        url: 'https://api.heweather.net/s6/weather/lifestyle',
        isAsync: true,
        parameter: {
          location: city,
          key: '843f111a3c464644ae2f75e8965a32f5'
        }
      }).then(value => {
        let v = value.HeWeather6;

        // 获取元素
        let liveIndex = document.querySelector('.liveIndex');
        liveIndex.innerHTML = '';
        // 创建元素
        let ul = document.createElement('ul');

        for (let i = 0; i < v.length; i++) {
          let life = v[i].lifestyle;
          ul.innerHTML = `<li><a class="liveImg"><img class="auto-img" src="./images/${life[1].type}.png"></a>
          <p class="live_ret">${life[1].brf}</p>
          <a class="liveType">穿衣</a>
          </li>
          <li><a class="liveImg"><img class="auto-img" src="./images/${life[14].type}.png"></a>
          <p class="live_ret">${life[14].brf}</p>
          <a class="liveType">钓鱼</a>
          </li>
          <li><a class="liveImg"><img class="auto-img" src="./images/${life[3].type}.png"></a>
          <p class="live_ret">${life[3].brf}</p>
          <a class="liveType">运动</a>
          </li>
          <li><a class="liveImg"><img class="auto-img" src="./images/${life[0].type}.png"></a>
          <p class="live_ret">${life[0].brf}</p>
          <a class="liveType">感冒</a>
          </li>`;

        }
        liveIndex.appendChild(ul)

      })
    }

    // 逐小时预报
    hourWeather(city) {
      var self = this;
      // 获取元素
      this.Get({
        type: 'GET',
        url: 'https://api.heweather.net/s6/weather/hourly',
        isAsync: true,
        parameter: {
          location: city,
          key: '843f111a3c464644ae2f75e8965a32f5'
        }
      }).then(value => {
        // 获取元素
        let foreBox = this.query('.foreBox');

        foreBox.innerHTML = '';

        let ul = document.createElement('ul');

        for (let i = 0; i < value.HeWeather6.length; i++) {
          let hourly = value.HeWeather6[i].hourly
          for (let j = 0; j < hourly.length; j++) {
            var li = document.createElement('li');
            li.innerHTML = `<p class="time">${hourly[j].time.slice(11)}</p>
            <p class="realImg"><img class="auto-img" src="./images/${hourly[j].cond_code}.png"></p>
            <p class="realTemp">${hourly[j].tmp}°C</p>`;

            ul.appendChild(li)
          }
        }

        foreBox.appendChild(ul);

      })
    }


  }

  let w = new Weather();
  // 改变背景图
  w.alterBg();



  // 初始化当前定位天气
  w.JSONP({
    url: 'https://apis.map.qq.com/ws/location/v1/ip',
    data: {
      key: 'Q3ZBZ-7C66P-D52D3-VBQXV-JUHZZ-4NBIJ',
      output: 'jsonp',
    },
    callback: 'callback'
  }).then(value => {
    // 初始化
    w.Initialize(value.result.ad_info.city)
    // 周天气预报
    w.InitWeek(value.result.ad_info.city);
    // 逐小时天气预报
    w.hourWeather(value.result.ad_info.city);
    // 生活指数
    w.liveStyle(value.result.ad_info.city);
  })
  // 绑定搜索事件
  w.AddEvent('click', '.search-btn', () => {
    // 获取搜索框
    let searchInp = w.query('.search>.inp');
    // value
    let value = searchInp.value;
    // 如果value为空，return
    if (value == '') {
      return;
    }

    w.Initialize(value);
    w.InitWeek(value);
    // 逐小时天气预报
    w.hourWeather(value);
    // 生活指数
    w.liveStyle(value);

    // 清空inp
    searchInp.value = '';
  })

  // 键盘事件
  document.onkeyup = e => {
    // 获取搜索框
    let searchInp = w.query('.search>.inp');
    // value
    let value = searchInp.value;

    // 如果value为空，return
    if (value == '') {
      return;
    }
    if (e.keyCode == 13) {
      w.Initialize(value)
      w.InitWeek(value);
      // 逐小时天气预报
      w.hourWeather(value);
      // 生活指数
      w.liveStyle(value);
      // 清空inp
      searchInp.value = '';
    }

  }

}
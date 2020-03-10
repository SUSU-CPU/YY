    // 设置rem自适应范围
    // resize 窗口大小发生改变的时候才会触发的，第一次加载时不会触发
    let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

    let setFontSize = () => {
      // 获取屏幕宽度
      let width = document.documentElement.clientWidth || document.body.clientWidth;
      let basicNum = 100;
      // 设置默认值 1rem = 100px;
      if(width>1200){
        basicNum = 40;
      }
      // 以iphone6的屏幕宽度375为标准屏幕,设置html字体大小
      var htmlFontSize = basicNum * (width / 375)
      document.documentElement.style.fontSize = htmlFontSize + 'px';      
    }

    // 监听手机屏幕是否改变
    window.addEventListener(resizeEvt, setFontSize, false); // IE 谷歌
    document.addEventListener('DOMContentLoaded', setFontSize, false);//火狐
    setFontSize()
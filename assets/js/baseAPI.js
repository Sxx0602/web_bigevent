 //此方法拼接url，是为了结构明了， 当需要修改根目录时不用每次请求都修改，而是通过ajaxPrefilter函数来修改一次根目录即可
 $.ajaxPrefilter(function(options) { //每次在请求数据之前会调用ajaxPrefilter函数并且传递参数
     options.url = 'http://www.liulongbin.top:3007' + options.url //将url的根目录和子目录拼接好
         //获取有权限url的身份验证字段 Authorization
     if (options.url.indexOf('/my/') != -1) {
         options.headers = {
             Authorization: localStorage.getItem('token') || ''
         }
     }

     //优化权限控制功能， 设置全局统一挂载 complete回调函数
     options.complete = function(res) {
         if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
             localStorage.removeItem('token')
             location.href = '/login.html'
         }
     }
 })
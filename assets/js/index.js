$(function() {
    //调用getUserInfo 获取用户的信息
    getUserInfo()
        //监听退出按钮的点击事件， 点击退出实现跳转到登录页面
    $('#btnLogout').on('click', function() {
        //调用layui中的layer属性编辑退出窗口
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //当点击退出选项后， 清除本地的token权限身份验证码
            localStorage.removeItem('token')
                //跳转到登录页面
            location.href = '/login.html'
                //最后关闭comfirt询问框
            layer.close(index)
        })
    })
})

function getUserInfo() { //请求用户的信息
    $.ajax({
        method: 'GET',
        url: '/my/userinfo', //引入baseApi脚本获取请求用户信息的根路径与主要路径进行拼接
        //headers 就是请求头配置对象，因为此url是带有权限的
        /*  headers: {
             //因为获取/my开头的路径的url是有权限的需要确认身份，所有headers表示获取头，其中获取本地token对象给Authorization
             Authorization: localStorage.getItem('token') || ''
         }, */
        success: function(res) {
            if (res.status != 0) { //status不等于0表示请求失败,返回layui提示信息
                return layui.layer.msg('获取失败')
            }
            //如果请求成功，调用renderAvatar函数渲染页面中的用户基本信息
            renderAvatar(res.data);
        },
        //当访问有权限的接口时，没有 Authorization 的身份验证码不会访问到该接口的则会请求失败
        //而jq中ajax请求定义了complete对象，表示不管请求成功还是失败都调用回调函数
        //当请求失败后，表示访问了有权限的接口，解决没有 Authorization 的身份验证码也可以访问有权限的接口的问题
        /* complete: function(res) {
            //判断如果res的responseJSON.status等于1， responseJSON.message等于身份认证失败！ 表示不能访问有权限的接口
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //清除掉本地token
                localStorage.removeItem('token')
                    //跳转回登录页面
                location.href = '/login.html'
            }
        } */
    })


    //定义randerAvatar函数，渲染用户头像，欢迎文本等信息
    function renderAvatar(user) {
        //获取用户名给name，如果有昵称显示昵称，没有就显示用户名
        var name = user.nickname || user.username
            //显示欢迎 *** 文本对应的内容
        $('#welcome').html('欢迎&nbsp;&nbsp' + name)
            //根据user.user_pic来决定头像是图片还是文本头像
        if (user.user_pic != null) {
            //如果有图片头像获取图片的url并且显示
            $('.layui-nav-img').attr('src', user.user_pic).show()
                //同时文本头像隐藏
            $('.text-avatar').hide()
        } else {
            //如果没有设置图片头像，则隐藏图片头像并且获取name的一个字符转换成大写填充在文本头像中显示出来
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase()
            $('.text-avatar').html(first).show()
        }
    }
}
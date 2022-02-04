$(function() {

    var form = layui.form
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称的长度必须在 1 ~ 6 个字符之间'
            }
        }
    })
    initUserInfo()
    var layer = layui.layer
        //定义一个函数，发起ajax请求，请求用户的信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('获取用户信息失败')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    //监听重置按钮的点击事件
    $('#btnReset').on('click', function(e) {
        //阻止默认提交行为
        e.preventDefault();
        //获取name名为nickname和email的input清空val
        $("input[name='nickname']").val('');
        $("input[name='email']").val('');
    })

    //监听基本资料修改用户信息表单的submit提交事件
    $('.layui-form').on('submit', function(e) {
        //阻止默认提交行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            //data请求修改的对象直接用serialize快速获取表单中的值
            data: $(this).serialize(),
            success: function(res) {
                if (res.status != 0) {
                    return layer.msg('更新用户信息失败！')
                }
                //如果请求成功，提示信息  更新用户信息成功
                layer.msg('更新用户信息成功！')
                    //并且 当前表单处于的是ifame子页面中，当点击提交新用户信息后，父页面的头像以及欢迎 ***要随着改变
                    //这是 window代表当前表单的ifame子页面的  parent代表父页面index  调用index中的getUserInfo方法实现修改用户信息的显示
                    //在子页面中调用父页面的函数就用window.parent.具体的函数名
                window.parent.getUserInfo();

            }
        })
    })

})
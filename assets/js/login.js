$(function() {
    $('#link_reg').on('click', function() {
        //点击去注册显示注册界面，隐藏登录界面
        $(this).parents('.login-box').hide().siblings().show()
    })

    $('#link_login').on('click', function() {
        //点击去登录显示登录界面，隐藏注册界面
        $(this).parents('.reg-box').hide().siblings().show()
    })

    //自定义表单验证规则
    var form = layui.form //获取layui中form对象
    var layer = layui.layer //获取layui中layer对象
    form.verify({ //给form的verify设置自定义规则，密码必须6到12位，不能有空格
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        repwd: function(value) { //多个自定义规则字段之间用逗号隔开
            //获取 注册窗口中元素name等于password也就是密码框中的密码
            var pwd = $('.reg-box [name=password]').val()
            if (value != pwd) { //如果再次输入的密码与密码框中输入的密码不一致
                return "两次输入的密码不一致" //返回消息验证提示
            }
        }
    })


    //监听注册表单提交事件
    $('#form_reg').on('submit', function(e) {
            e.preventDefault()
            var uname = $('#form_reg [name=username]').val()
            var pwd = $('#form_reg [name=password]').val()
            $.ajax({
                method: 'POST',
                url: '/api/reguser',
                data: {
                    username: uname,
                    password: pwd
                },
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg(res.message) //如果请求数据失败，表示服务器中已有当前注册的账号返回提示信息
                    }
                    $('#link_login').click(); //如果请求数据成功，表示服务器中没有当前注册的账号返回注册成功并且模拟去登录的点击事件跳转到登录窗口
                    return layer.msg('注册成功，请登录')

                }
            })
        })
        //监听登录表单提交事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault();
        var data = $(this).serialize(); //快速获取表单中的数据
        $.post('/api/login', data,
            function(res) {
                if (res.status != 0) {
                    return layer.msg(res.message) //请求失败，登录失败
                }
                localStorage.setItem('token', res.token) //将请求成功后的res的token对象存储在本地存储，保证当有权限的接口能够运行
                window.open("/index.html", '_blank') //open属性表示跳转页面到index.html并且新开一个窗口显示idnex.html页面
                return layer.msg(res.message) //请求成功，登录成功
            })
    })
})
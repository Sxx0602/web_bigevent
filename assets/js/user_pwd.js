$(function() {
    var layer = layui.layer
        //定义layui的form对象
    var form = layui.form
        // form对象调用verify设置表单验证信息
    form.verify({
        //新密码的规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        // 判断新密码与原密码不能相同，否则修改密码无意义
        samePwd: function(value) {
            //如果 value当前输入的密码与原密码相同，则返回错误提示信息
            if (value === $('[name=oldPwd]').val()) {
                return '新密码与原密码不允许相同'
            }
        },
        // 确认新密码与新密码需填写一致
        repwd: function(value) {
            var newPwd = $('[name=newPwd]').val();
            if (value != newPwd) {
                return "两次输入的密码不一致" //返回消息验证提示
            }
        }
    })

    //监听个人中心，重置密码表单的submit提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('原密码不正确，修改密码失败')
                }
                layer.msg('修改密码成功')
                    /*  当修改密码成功后，需要重置表单内容，用jq对象没有重置函数，需要将jq对象转换为document对象在进行重置 */
                $('.layui-form')[0].reset()
            }
        })
    })
})
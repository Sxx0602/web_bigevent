// 1.1 获取裁剪区域的 DOM 元素
var $image = $('#image')
    // 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)
    // 1.4 选择图片更换新的头像
    //监听上传按钮点击事件
$('#btnChooseImage').on('click', function() {
        $('#file').click() //模拟file类型input的点击事件
    })
    // 设置 layui的layer对象，调用layer的msg提示框
var layer = layui.layer
    //监听file的change事件，事件名e
$('#file').on('change', function(e) {
    //获取触发事件后选择的文件files数组
    var filelist = e.target.files
        //如果数组的长度为0相当于没有选择文件
    if (filelist.length === 0) {
        //返回 layer的msg
        return layer.msg('请选择照片')
    }
    //   开始更换新头像
    //如果选择了图片，将files中的索引为0的图片赋值给file
    var file = e.target.files[0]
        //第二步，将选择的图片转换为对应的路径
    var imgURL = URL.createObjectURL(file)
        //最后一步 
    $image
        .cropper('destroy') //将旧裁剪图片销毁
        .attr('src', imgURL) //更换图片的新路径
        .cropper(options) //重新设置裁剪区域
})


// 监听确定按钮的点击事件，将裁剪完成后的图片上传服务器中
$('#btnUpload').on('click', function() {
    // 第一步： 获取裁剪完成的图片
    //调用下面的dataURL对象可以得到裁剪完成的头像
    var dataURL = $image
        .cropper('getCroppedCanvas', { //创建一个Canvas画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png') //将Canvas画布上的内容，转化为base64格式的字符串

    // 第二步： 将获取的裁剪后的图片通过接口上传到服务器上
    $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        //请求体， 中 一个字段avatar将获取的裁剪后的图片dataURL传进去
        data: {
            avatar: dataURL
        },
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('更换头像失败！')
            }
            //如果请求成功， 提示信息并且调用父页面的函数，请求更新用户并且获取更新之后的用户信息，实现头像的改变
            layer.msg('更换头像成功！')
            window.parent.getUserInfo()
        }
    })
})
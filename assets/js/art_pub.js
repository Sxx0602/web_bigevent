$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate() //调用函数
        //初始化富文本编辑器的实现函数
    initEditor()
        //定义发起ajax请求动态生成下拉列表中的文章类别选项
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别选项失败')
                }
                //调用模板引擎，渲染文章类别下拉列表
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    //1.初始化图片裁剪器
    var $image = $('#image')
        //2.裁剪选项
    var options = {
            aspectRatio: 400 / 280,
            preview: '.img-preview'
        }
        //3.初始化裁剪区域
    $image.cropper(options)

    //监听选择封面按钮的点击事件，模拟文件input的点击事件
    $('#btnChooseImage').on('click', function(e) {
        $('#coverFile').click() //模拟file的input点击事件选择文件
    })

    //监听文件选择器的change事件
    $('#coverFile').on('change', function(e) {
        if (e.target.files.length === 0) {
            return layer.msg('请选择图片文件')
        }
        //1. 获取选择的文件
        var file = e.target.files[0]
            //2. 转换为url图片的地址
        var newURL = URL.createObjectURL(file)
            //3. 销毁旧的裁剪区域，修改图片的路径，重新选择裁剪区域,为裁剪区域重新设置图片
        $image
            .cropper('destroy') //销毁旧的裁剪区域
            .attr('src', newURL) //将重新选择的文件的路径添加到src
            .cropper(options) //重新选择裁剪区域
    })

    //定义默认state状态默认是已发布
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿' //当点击 存为草稿按钮则state状态变为草稿
    })

    //1. 监听表单submit事件获取请求体
    $('#form-pub').on('submit', function(e) {
            e.preventDefault()
                //2. 将表单的数据转换为dom对象，快速生成一个FormData对象
            var fd = new FormData($(this)[0]) //将当前表单提交后的所有对象变为dom对象进行创建FormData给fd
            fd.append('state', art_state) //3. 将文章的状态追加到fd对象中
                //4. 将裁剪后的图片输入为一个文件
            $image
                .cropper('getCroppedCanvas', {
                    //i创建一个Canvas画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) {
                    //将 Canvas 画布上的内容，转化为文件对象
                    //得到文件对象后，进行后续的操作
                    //5. 将文件对象，存储到fd中
                    fd.append('cover_img', blob)
                        //6. 发起ajax请求
                    publishArticle(fd)
                })
        })
        //定义函数 publishArticle发起ajax请求
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意：  如果向服务器提交的是 FormData 格式的数据，
            //必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布新文章失败！')
                }

                location.href = '../article/article_list.html'
            }
        })
    }
})
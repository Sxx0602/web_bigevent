$(function() {
    //定义layui的layer
    var layer = layui.layer
        //调用initArtCateList函数
    initArtCateList()
        //定义函数发起请求
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: {},
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类列表失败')
                }
                /*  调用模板引擎函数template将自定义模板的id和请求到的res进行传递 */
                var htmlStr = template('tpl-table', res)
                    /*   渲染表格中tbody中的表格内容 */
                $("#tb").html(htmlStr)
            }
        })
    }

    //监听添加类别按钮的点击事件
    var indexAdd = null //定义一个空indexAdd存放弹出层
    $('#btnAddCate').on('click', function() {
        //调用layer的open函数可以实现弹出层
        indexAdd = layer.open({
            type: 1, //设置open的type表示页面层没有确定按钮的页面层
            area: ['500px', '250px'], //area表示设置页面层的宽高，索引为0的是宽度，索引为1是高度
            title: '添加文章分类', //弹出框的标题
            //弹出框中的表单数据的呈现，在js中添加表单是非常麻烦的，
            //content的值就是弹出框的内容部分，所以我们准备了text/html类型的脚本，在里面编写好对应的表单样式
            //然后获取脚本中的内容渲染到弹出框的content中
            content: $('#dialog-add').html()
        })
    })

    //因为弹出框中的content内容表单是在脚本中，在页面中是不存在的，是动态创建出来的
    //想要给此表单监听submit事件会报错，解决办法是通过代理的方式给表单监听submit
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault(); //阻止提交默认行为
        $.ajax({ //发起ajax请求
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(), //快速获取当前表单的数据给data
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类文章失败')
                }
                //如果新增成功，提示信息，并且调用initArtCateList函数来重新获取文章分类列表
                layer.msg('新增分类文章成功')
                initArtCateList()
                    //当新增成功后，需要自动的关闭添加文章类型的弹出层
                layer.close(indexAdd)
            }
        })
    })

    //监听 编辑 按钮的 点击事件,  编辑按钮时动态生成的需要用on来监听代理事件
    var indexEdit = null //定义indexEdit存放 弹出层
    var form = layui.form //调用  layui的form实现快速填充表单
    $('#tb').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1, //设置open的type表示页面层没有确定按钮的页面层
            area: ['500px', '250px'], //area表示设置页面层的宽高，索引为0的是宽度，索引为1是高度
            title: '修改文章分类', //弹出框的标题
            //弹出框中的表单数据的呈现，在js中添加表单是非常麻烦的，
            //content的值就是弹出框的内容部分，所以我们准备了text/html类型的脚本，在里面编写好对应的表单样式
            //然后获取脚本中的内容渲染到弹出框的content中
            content: $('#dialog-edit').html(),
        })

        //发起ajax请求，填充当前行的分类名称和分类别名
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            //url   主路径加上id通过编辑按钮的id获取对应的data数据
            url: '/my/article/cates/' + id,
            success: function(res) {
                //将请求成功后的数据填充到对应的表单中
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式为  编辑按钮点击后的弹出层中的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(), //快速获取当前表单的数据，表单中的input的name属性值必须和接口中的请求体的属性值一致
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类文章数据失败')
                }
                layer.msg('更新分类文章数据成功') //如果请求成功提示成功信息
                layer.close(indexEdit) //关闭索引为indexEdit的弹出层
                initArtCateList() //重新调用获取分类文章列表的函数，显示更新之后的分类文章信息
            }
        })
    })


    //  监听删除按钮的点击事件，同时需要以代理的形式
    $('#tb').on('click', '.btn-delete', function() {
        var dataId = $(this).siblings().attr('data-id') //获取自定义属性data-id的id
            //创建删除提示信息框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //发起ajax请求来删除对应id的分类文章
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + dataId,
                data: dataId,
                success: function(res) {
                    if (res.status !== 0) {
                        console.log(res);
                        return layer.msg('删除分类文章数据失败')
                    }
                    layer.msg('删除分类文章数据成功')
                    initArtCateList()
                }
            })
            layer.close(index)
        })
    })
})
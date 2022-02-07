$(function() {
    //1.   定义一个查询字符串，每次发起请求时都携带这个参数对象并将这个参数对象提交到服务器
    var q = {
            pagenum: 1, //页码值，当前的页码默认请求第一页的数据
            pagesize: 2, //每页显示几条数据，默认两条
            cate_id: '', //分类文章的Id
            state: '' //文章的发布状态
        }
        //调用layer
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    initTable() //调用initTable函数发起请求
        //定义一个发起ajax请求的获取数据的函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q, //携带对应的参数对象
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败')
                }
                //请求成功后，调用模板引擎渲染页面
                var htmlStr = template('tpl-table', res)
                $('#tb').html(htmlStr)
                renderPage(res.total) //调用分页函数
            }
        })
    }
    initCate()
        //定义请求文章类别函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //监听筛选表单按钮的submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        q = {
            pagenum: 1, //页码值，当前的页码默认请求第一页的数据
            pagesize: 2, //每页显示几条数据，默认两条
            cate_id: cate_id, //分类文章的Id
            state: state //文章的发布状态
        }
        initTable()
    })

    //定义分页函数
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器的Id
            count: total, //总数据的条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认被选中的页码
            //  laypage.render()方法中，还包括layout数组，表示分页的ui结构， 顺序为 总条数 每页显示的条数 上一页 页码 下一条 跳转页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 8], //limits是数组类型，控制每页显示的自定义的条数
            //jump回调有两种方式触发回调。
            //一种是点击了页码触发jump，另一种是只要调用了laypage.render()就会触发jump，
            jump: function(obj, first) { //通过jump回调获取最新的页码值   first作用是判断以哪一种方式触发的jump回调，true表示第二种方式，false表示第一种方式
                q.pagenum = obj.curr //将obj中的curr页码值给q的pagenum
                q.pagesize = obj.limit //将obj中的每页显示条数limit值给q的pagesize
                if (!first) { //如果不设置当前first的判断条件，利用第二种方式触发jump回调会一直回调，进入死循环
                    initTable() //当获取了最新页码值赋值给q，在发起获取文章列表的请求
                }

            }
        })
    }

    //删除文章的功能
    //通过代理的方式，监听 文章列表中删除按钮的点击事件
    $('#tb').on('click', '.btn-delete', function() {
        //获取当前页的删除按钮的个数,此处必须以类获取不能以id获取，因为id是唯一的，只能获取到一个元素，
        //当一id获取个数时，得到的个数永远是1
        var len = $('.btn-delete').length
        console.log(len);
        //获取当前删除按钮的自定义属性的id
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id, //通过url拼接查询字符串对应的数据的id
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        //当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                        //如果没有剩余的数据了，则让页码值 -1 之后，
                        //在重新调用 initTable 方法
                    if (len === 1) {
                        //如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable() //如果请求删除文章成功了，重新调用initTable()来渲染删除之后的文章列表
                }
            })
            layer.close(index) //关闭弹出层
        })
    })


    //编辑文章的功能
    //通过代理的方式，监听 文章列表中编辑按钮的点击事件

})
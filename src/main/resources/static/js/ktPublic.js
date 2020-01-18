/**
 * 公共js
 * @type {index|BigInt|number|*|jQuery}
 */

// 页签选择更新面包悄事件
$('.nav-tabs').find('.nav-link').on('click', function () {
    $('.breadcrumb').find('.active').text($(this).text());
});

// 鼠标经过头像框触发动画事件
$('.kt-img-box').hover(function() {
    $(this).find('.kt-img-inf').animate({"margin-top": "-20px"}, 100, "swing");
},function() {
    $(this).find('.kt-img-inf').stop(true, false).animate({"margin-top": "0"}, 100, "swing");
});

// 鼠标经过导航栏下拉导航展开效果
var dropdownEle = $('.dropdown');
dropdownEle.on('mouseover', function () {
    $(this).addClass('show');
    $(this).find('div').addClass('show');
});

// 鼠标离开导航栏下拉导航收起效果
dropdownEle.on('mouseleave', function () {
    $(this).removeClass('show');
    $(this).find('div').removeClass('show');
});

// 网站标题特效事件
$('.skew-title').children('span').hover((function() {
    var $el, n;
    $el = $(this);
    n = $el.index() + 1;
    $el.addClass('flat');
    if (n % 2 === 0) {
        return $el.prev().addClass('flat');
    } else {
        if (!$el.hasClass('last')) {
            return $el.next().addClass('flat');
        }
    }
}), function() {
    return $('.flat').removeClass('flat');
});

// 初始化模态框
$("body").append('<!-- 模态框 -->\n' +
    '  <div class="modal fade" id="myModal" style="top: 31%;">\n' +
    '    <div class="modal-dialog modal-sm">\n' +
    '      <div class="modal-content">\n' +
    '        <!-- 模态框头部 -->\n' +
    '        <div class="modal-header" style="background: #73a6c1">\n' +
    '          <h4 class="modal-title">提示</h4>\n' +
    '          <button type="button" class="close" data-dismiss="modal">&times;</button>\n' +
    '        </div>\n' +
    '        <!-- 模态框主体 -->\n' +
    '        <div class="modal-body kt-fc-title">\n' +
    '        </div>\n' +
    '        <!-- 模态框底部 -->\n' +
    '        <div class="modal-footer">\n' +
    '          <button type="button" class="btn btn-secondary" data-dismiss="modal">关闭</button>\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  </div>');

// 实例化tooltips
$('[data-toggle="tooltip"]').tooltip();

// autoPushLink();

/**
 * 自动提示交链接到百度站长平台
 */
function autoPushLink() {
    if (window.location.host !== 'localhost') {
        var bp = document.createElement('script');
        var curProtocol = window.location.protocol.split(':')[0];
        if (curProtocol === 'https') {
            bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
        }
        else {
            bp.src = 'http://push.zhanzhang.baidu.com/push.js';
        }
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(bp, s);
    }
}

/**
 * 发表评论
 */
function addComment(isAsc) {
    var commentContext = $('#commentContext').val();
    var $cl = $('.gitment-comments-list');
    if (commentContext) {
        if (isAsc) {
            commentContext = '```\n' + commentContext + '\n```';
        }
        // 将评论内容转化成html
        var htmlContext = ktUtils.makeHtml(commentContext);
        // log('htmlContext=', htmlContext);

        // 新增评论
        var params = {userId: ktConfig.userId, menuId: ktConfig.menuId, comment: commentContext};
        ktUtils.aPost(ktConfig.api.addComment, params, function (r) {
            if (r.errorCode === ktConfig.request.okCode) {

                var avatarUrl = $('.gitment-editor-avatar').attr('href');

                var commentHtml = '<li class="gitment-comment" id="' + r.data + '">\n' +
                    '                                    <!--头像-->\n' +
                    '                                    <a class="gitment-comment-avatar" href="' + avatarUrl + '" target="_blank">\n' +
                    '                                        <img class="gitment-comment-avatar-img" src="' + avatarUrl + '">\n' +
                    '                                    </a>\n' +
                    '                                    <!-- 主要内容 -->\n' +
                    '                                    <div class="gitment-comment-main">\n' +
                    '                                        <div class="gitment-comment-header">\n' +
                    '                                            <a class="gitment-comment-name" href="javascript:void();" target="_blank" id="' + ktConfig.userId + '">' + ktConfig.nickname + '</a>\n' +
                    '                                            发表于\n' +
                    '                                            <span title="">' + new Date().format('yyyy-MM-dd hh:mm:ss') + '</span>\n' +
                    // '                                            <div data-likeIt="0" onclick="likeComment(this)" class="gitment-comment-like-btn"><svg class="gitment-heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path d="M25 39.7l-.6-.5C11.5 28.7 8 25 8 19c0-5 4-9 9-9 4.1 0 6.4 2.3 8 4.1 1.6-1.8 3.9-4.1 8-4.1 5 0 9 4 9 9 0 6-3.5 9.7-16.4 20.2l-.6.5zM17 12c-3.9 0-7 3.1-7 7 0 5.1 3.2 8.5 15 18.1 11.8-9.6 15-13 15-18.1 0-3.9-3.1-7-7-7-3.5 0-5.4 2.1-6.9 3.8L25 17.1l-1.1-1.3C22.4 14.1 20.5 12 17 12z"></path></svg><span class="commentLikeNum">0</span></div>\n' +
                    '                                            <div data-likeIt="0" onclick="likeComment(this)" class="gitment-comment-like-btn"><span class="glyphicon glyphicon-heart-empty kt-heart15-empty"></span><span class="commentLikeNum">0</span></div>\n' +
                    '                                        </div>\n' +
                    '                                        <div class="gitment-comment-body gitment-markdown"><p>' + htmlContext + '</p></div>\n' +
                    '                                    </div>\n' +
                    '                                </li>';

                if ($cl.find('li').length === 0) {
                    $('.gitment-comments-error').remove();
                    $cl.append(commentHtml);
                } else {
                    $cl.find('li').first().before(commentHtml);
                }
                // 清空评论框
                $('#commentContext').val('');
            } else {
                alert('评论发表失败，请重试');
            }
        });

    } else {
        alert('你啥都没有发表~~!');
    }
}

/**
 * 点赞工具
 * @param obj
 */
function likeTool(obj) {
    var $l = $('.gitment-header-like-btn');
    var likeIt = $(obj).attr('data-likeIt');
    var params = {userId: ktConfig.userId, menuId: ktConfig.menuId};
    var $lnEl = $('#likeNum');

    if (Number(likeIt) === 0) { // 执行点赞/喜欢操作
        ktUtils.aPost(ktConfig.api.giveLikeTool, params, function (r) {
            if (r.errorCode === ktConfig.request.okCode) {
                // likeNum+1
                var likeNum = Number($lnEl.text());
                $lnEl.text(likeNum + 1);
                $l.attr('data-likeIt', '1');

                // 更新心的颜色为 红色
                $(obj).find('span.glyphicon').attr('class', 'glyphicon glyphicon-heart kt-heart25-red');
            }
        });
    }
    if (Number(likeIt) === 1) { // 执行取消点赞/喜欢操作
        ktUtils.aPost(ktConfig.api.dislikeTool, params, function (r) {
            if (r.errorCode === ktConfig.request.okCode) {
                // likeNum+1
                var likeNum = Number($lnEl.text());
                $lnEl.text(likeNum - 1);
                $l.attr('data-likeIt', '0');

                // 更新心的颜色为 白色
                $(obj).find('span.glyphicon').attr('class', 'glyphicon glyphicon-heart-empty kt-heart25-empty');
            }
        });
    }
}

/**
 * 点赞评论
 * @param obj
 */
function likeComment(obj) {
    var likeIt = $(obj).attr('data-likeIt');
    var commentId = $(obj).parents('.gitment-comment').attr('id');
    var params = {giveLikeUserId: ktConfig.userId, id: commentId};
    var $lnEl = $(obj).find('.commentLikeNum');
    if (Number(likeIt) === 0) { // 执行点赞/喜欢操作
        ktUtils.aPost(ktConfig.api.giveLikeComment, params, function (r) {
            if (r.errorCode === ktConfig.request.okCode) {
                // likeNum+1
                var likeNum = Number($lnEl.text());
                $lnEl.text(likeNum + 1);
                $(obj).attr('data-likeIt', '1');
                // todo 更新心的颜色为 红色

                $(obj).find('span.glyphicon').attr('class', 'glyphicon glyphicon-heart kt-heart15-red');
            }
        });
    }
    if (Number(likeIt) === 1) { // 执行取消点赞/喜欢操作
        ktUtils.aPost(ktConfig.api.dislikeComment, params, function (r) {
            if (r.errorCode === ktConfig.request.okCode) {
                // likeNum+1
                var likeNum = Number($lnEl.text());
                $lnEl.text(likeNum - 1);
                $(obj).attr('data-likeIt', '0');

                // todo 更新心的颜色为 白色
                $(obj).find('span.glyphicon').attr('class', 'glyphicon glyphicon-heart-empty kt-heart15-empty');
            }
        });
    }
}

/**
 * 分页查看评论 事件
 */
$('#commentPage').on('click', '.gitment-comments-page-item', function () {
    var $preSelEl = $('#commentPage').find('.gitment-selected');
    var preSelVal = $preSelEl.text();
    $preSelEl.removeClass('gitment-selected');

    var val = $(this).text();
    if (val && val !== 'Next' && val !== 'Previous') {
        $(this).attr('class', 'gitment-comments-page-item gitment-selected');
        ktUtils.initComments(Number(val));  // 重新加载评论列表
    } else if (val === 'Next') {
        val = Number(preSelVal) + 1;
        $preSelEl.next().attr('class', 'gitment-comments-page-item gitment-selected');
        ktUtils.initComments(val);
    } else if (val === 'Previous') {
        val = Number(preSelVal) - 1;
        $preSelEl.prev().attr('class', 'gitment-comments-page-item gitment-selected');
        ktUtils.initComments(val);
    }
});

/**
 * 实例化更新日志通知条
 * http://www.bootstrapmb.com/item/1855
 */
$(".updateLogTicker").smarticker({
    theme: 4,
    speed: 3000,
    pausetime: 3600,
    // animation: "fade",  // slide、typing、fade
    // rounded: true,
    title: "更新日志"
});

/**
 * 点击跳转到关于页面
 */
$('.updateLogTicker').on('click', 'div', function (e) {
    var cls = $(e.currentTarget).attr('class');
    if (cls.indexOf('tickertitle') !== -1) {
        window.open(kfc + '/about');
    }
});
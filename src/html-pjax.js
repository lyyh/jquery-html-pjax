/**
 * htmlpajx插件
 * @authors liuyanhao (374659635@qq.com)
 * @date    2017-01-19 10:05:49
 * @version $0.1.0$
 */

(function(window, $, undefined) {
    var originUrl = window.location.href, //最初访问的url
        //默认配置
        config = {
            selector: 'a', //默认事件选择器
            container: 'body', //默认内容选择器
            hash: 'main', //首页hash值
            indexPage: 'index.html', //首页
            paths: '', //默认当前目录下
            refreshtoIndex: true //刷新之后回到首页 false不返回首页
        },

        pjax = {
            //处理刷新事件
            refreshHandle: function() {
                var self = this;
                onRefresh(function() {

                })
            },
            //刷新之后跳转至首页
            refreshToIndex: function(options) {
                var self = this;
                self.onRefresh(function() {
                    var originHash = null,
                        url = window.location.href;

                    //记录压入历史栈
                    window.history.pushState({
                        origin: originHash
                    }, null, url);
                });

                if ($("#" + options.hash)) {
                    var url = ''
                    if (originUrl.indexOf('.html') >= 0) {
                        url = originUrl.replace(originUrl.substring(originUrl.indexOf('#')), '#' + options.hash);
                        window.location.href = url;
                    } else {
                        window.location.href = originUrl + options.indexPage + '#' + options.hash;
                    }
                }
            },
            //刷新事件
            onRefresh: function(fn) {
                window.onbeforeunload = function(event) {
                        //关闭浏览器
                        if (event.clientX > document.body.clientWidth && event.clientY < 0 || event.altKey) {
                        } else { //刷新了页面
                            fn();
                        }
                    }
            },
            //初始化
            init: function(options) {
                var self = this;

                //监听点击事件
                $(options.selector || options.selector).click(function() {
                    var target = $(this).data('target'),
                        originHash = window.location.href.split('#')[1] || options.hash || config.hash,
                        url = '',
                        tmp = '',
                        repStr = '';

                    if (originUrl.indexOf('.html') < 0) {
                        //无.html 无#
                        if (originUrl.indexOf('#') < 0) {
                            if (repStr = self.queryFilter()) {
                                url = originUrl.replace(repStr, '') + (options.indexPage || config.indexPage) + '#' + target;
                            } else {
                                url = originUrl + (options.indexPage || config.indexPage) + '#' + target;
                            }
                        }
                        //无.html 有# 
                        else {
                            if (repStr = self.queryFilter()) {
                                url = originUrl.replace(repStr, (options.indexPage || config.indexPage) + repStr);
                            }
                            tmp = originUrl.substring(originUrl.indexOf('#'));
                            url = originUrl.replace(tmp, (options.indexPage || config.indexPage) + '#' + target);
                        }
                    } else {
                        //有.html 无#
                        if (originUrl.indexOf('#') < 0) {
                            url = originUrl + '#' + target;
                        }
                        //有.html 有# 
                        else {
                            tmp = originUrl.substring(originUrl.indexOf('#'));
                            url = originUrl.replace(tmp, '#' + target);
                        }
                    }

                    //记录压入历史栈
                    window.history.pushState({
                        origin: originHash
                    }, null, url);

                    var html = url.substring(url.lastIndexOf('/'));
                    self.ajaxHandle(url.replace(html, '/' + options.paths + '/' + target + '.html'), options.container);
                })

                //popstate事件
                window.onpopstate = function(event) {
                    var urlProcess = '',
                        currentUrl = window.location.href,
                        hash = currentUrl.split('#')[1] || options.indexPage,
                        urlRep = currentUrl.substring(currentUrl.lastIndexOf('/'));

                    if (currentUrl.indexOf('#') < 0 || currentUrl.indexOf('#' + options.hash) >= 0) {
                        if (currentUrl.lastIndexOf('/') + 1 == currentUrl.length) {
                            urlProcess = currentUrl + options.paths + "/" + options.hash + '.html';
                        } else {
                            urlProcess = currentUrl.replace(urlRep, '/' + options.paths + '/' + options.hash + '.html');
                        }
                    } else {
                        if (repStr = self.queryFilter(currentUrl)) {
                            urlProcess = currentUrl.replace(repStr, options.paths + "/" + hash.replace(/\?.*/, '') + '.html');
                        } else {
                            urlProcess = currentUrl.replace(urlRep, "/" + options.paths + "/" + hash + '.html');
                        }
                    }
                    self.ajaxHandle(urlProcess, options.container);
                }
            },
            //发起ajax请求
            ajaxHandle: function(url, container) {
                $.ajax({
                        url: url,
                        type: 'get',
                        dataType: 'html',
                        headers: {
                            'H_PJAX': true
                        }
                    })
                    .done(function(dataHtml) {
                        $(container).html(dataHtml);
                    })
                    .fail(function() {
                        console.log("加载失败!");
                    })
                    .always(function() {});
            },

            //过滤问号
            queryFilter: function(currentUrl) {
                var queryIndex = '',
                    repStr = '',
                    url = currentUrl || originUrl;

                if (!/\#.*\?/.test(url) && (queryIndex = url.indexOf('?')) >= 0) {
                    repStr = url.substring(queryIndex);
                    return repStr;
                } else if (/\#.*\?/.test(url)) {
                    repStr = url.substring(url.indexOf('#'));
                    return repStr;
                } else {
                    return null;
                }
            }
        };

    //amd
    if (typeof define === 'function' && define.amd) {
        define([], function() {
            return pjax;
        });
        //cmd
    } else if (typeof module === 'object' && typeof exports === 'object') {
        module.exports = pjax;
        //jquery
    } else if (jQuery) {
        $.extend({
                htmlPjax: function(options) {
                    options.refreshtoIndex = options.refreshtoIndex || true;
                    if (!options.refreshtoIndex && !config.refreshtoIndex) {
                        pjax.refreshHandle();
                    } else { //默认刷新回到首页
                        pjax.refreshToIndex(options);
                    }
                    pjax.init(options);
                }
            })
            //window全局变量
    } else {
        window.htmlPajx = pjax;
    }
})(window, jQuery);

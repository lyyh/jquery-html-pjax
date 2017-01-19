# HTML PJAX
之前使用jquery.pjax.js在直接请求html页面的时候会对html页面内容进行限制。若出现html标签则会跳转页面，无法实现局部刷新。  
htmlpjax针对诸如问题进行了修正，可以正常请求html页面  

## 使用方法
依赖于jquery  

```
$.htmlPjax({
            selector: 'a', //默认事件选择器
            container: 'body', //默认内容选择器
            hash: '#main', //首页hash值
            indexPage: 'index.html', //首页
            paths: '', //默认当前目录下
            refreshtoIndex: true //刷新之后回到首页 false不返回首页
    })
```

## license
MIT
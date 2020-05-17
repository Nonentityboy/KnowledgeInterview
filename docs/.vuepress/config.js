
module.exports = {
    title: '前端知识总结',
    description: 'Curtin的前端笔记',
    themeConfig: {
        sidebar: 'auto',
        nav: [
            { text: '主页', link: '/' },
            {
                text: '知识图谱',
                items: [
                    { text: '前端基础进阶', link: '/feInterview/', },
                    { text: '计算机基础进阶', link: '/csInterview/' },
                    { text: '算法与数据结构', link: '/JSalgorithm/' },
                ]
            },
            { text: '关于', link: '/about/' },
            { text: 'Github', link: 'https://www.github.com/nonentityboy' },
        ],
        sidebar: {
            '/feInterview/': [
                ['CSS', 'CSS常见布局'],
                ['JS_base', 'JS基础'],
                ['JS_array', 'JS深入数组'],
                ['JS_V8', 'JS深入V8引擎'],
                ['JS_promise', 'JS-异步I/O及异步编程'],
                ['性能', '性能相关'],
                ['浏览器-安全', '浏览器-安全相关'],
                ['浏览器-渲染', '浏览器-渲染相关'],
                ['前端工程化', '前端工程化'],
                ['跨端开发', '跨端开发实践']
            ],
            '/csInterview/': [
                ['HTTP', 'HTTP协议'],
                ['TCP-UDP', 'TCP、UDP协议'],
            ]
        },
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        themeConfig: {
            sidebar: 'auto'
        }

    },
}
const markdown = require('../../utils/markdown/index.js').markdown

const a = (node, n, data) => {
        for (let i=1; i<node.length; i++) {
             console.log(node[i]);
            if ( node[i][2] && Array.isArray(node[i][2]) ) {
                data.push({
                    style: 'h'+n,
                    content: node[i][1],
                })
                a(node[i][2], n+1, data)
            } else {
                data.push({
                    style: 'h'+n,
                    content: node[i][1],
                })
            }
        }
}

Page({
    data: {
        node: []
    },
    onLoad() {
      wx.request({
        url: 'https://raw.githubusercontent.com/TeamStuQ/skill-map/master/data/map-OpenResty.md',
        success: (res) => {
        var data = []
        var tree = markdown.parse( res.data )
        tree.forEach((node)=>{
            if (Array.isArray(node) && node[0] === 'header' && node[1].level === 1) {
                data.push({
                    style: 'h1',
                    content: node[2],
                })
            }
            if (Array.isArray(node) && node[0] === 'header' && node[1].level === 2) {
                data.push({
                    style: 'h2',
                    content: node[2],
                })
            }
            if (Array.isArray(node) && node[0] === 'header' && node[1].level === 3) {
                data.push({
                    style: 'h3',
                    content: node[2],
                })
            }
            if (Array.isArray(node) && node[0] === 'bulletlist') {
                a(node, 4, data)
            }
        })
        this.setData({
            node: data
        })
      },
      fail() {
        console.log('fail');
      },
      complete() {
        console.log('complete')
      }
    })
    }
});
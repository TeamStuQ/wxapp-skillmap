const markdown = require('../../utils/markdown/index.js').markdown
const store = require('../../store/store.js')

const parseList = (node, n, data) => {
    for (let i=1; i<node.length; i++) {
        //  console.log(node[i]);
        if ( node[i][2] && Array.isArray(node[i][2]) ) {
            data.push({
                style: 'l'+n,
                content: node[i][1],
            })
            parseList(node[i][2], n+1, data)
        } else {
            data.push({
                style: 'l'+n,
                content: node[i][1],
            })
        }
    }
}

Page({
    data: {
        skill: {},
        node: []
    },
    onLoad(option) {
        if(option.index === undefined) return;
        wx.request({
            url: store.skills[option.index].link,
            success: (res) => {
                this.setData({
                    skill: store.skills[option.index]
                })
                var data = []
                var tree = markdown.parse( res.data )
                tree.forEach((node)=>{
                    if (Array.isArray(node) && node[0] === 'header' && node[1].level === 1) {
                        // data.push({
                        //     style: 'h1',
                        //     content: node[2],
                        // })
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
                        parseList(node, 1, data)
                    }
                })
                this.setData({
                    node: data
                })
            },
          fail() {
          },
          complete() {
          }
        })
    }
});

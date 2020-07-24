var express = require('express');
var fs = require('fs')
var xlsx = require('node-xlsx');
var template = require('art-template');
var router = express.Router();

router.post('/setFilesDirect', function (req, res, next) {
    let sheets = xlsx.parse('./resource/excel.xlsx');
    sheets.forEach(function (sheet) {
        console.log(sheet['name']);
        for (var rowId in sheet['data']) {
            console.log(rowId);
            var row = sheet['data'][rowId];
            console.log(row);
        }
    });
    fs.writeFile("./out/test.txt", "Hello World11", err => {
        if (err) {
            console.log(err)
            throw err
        }
    })
    fs.mkdir('./out/tsx', function (err) {
        if (err) return;
        console.log('创建目录成功');
    })
    res.send({
        code: 0,
        data: "",
        message: 'success'
    })
});

router.post('/getFilesDemo2', function (req, res, next) {
    fs.readFile('./public/template/index.jsx', (err, data) => {
        if (err) {
            return res.end('readFile failed...')
        }
        const dataStr = data.toString()
        const strHtml = template.render(dataStr, {
            title: '个人介绍',
            name: 'Kobe',
            from: 'America',
            hobbies: ['basketball', 'swimming', 'sleep']
        })
        console.log(strHtml)
        res.end(strHtml)
    })
});

router.post('/getFiles', async function (req, res, next) {
    // 读取excel
    let resFiles = await getExcelFile('./resource/excel.xlsx')
    // 创建生成文件目录
    await createRootDirect()
    // 创建模块子目录
    await createChildrenDirect(resFiles)
    // 读取List模板
    let templateList = await getTemplate('./public/template/index.jsx')
    // 读取search 模板
    let templateSearch = await getTemplate('./public/template/search.jsx')
    // 读取modal 模板
    let templateModal = await getTemplate('./public/template/modal.jsx')

    resFiles.forEach(item=>{
        const strHtmlList = template.render(templateList, [item])
        // 输出 Manger主文件
        fs.writeFile("./out/"+ item.taleName + '/' +  item.taleName +"List.jsx", strHtmlList, err => {
            if (err) {
                console.log(err)
                throw err
            }
        })
        // 输出 search 文件
        const strHtmlSearch = template.render(templateSearch,[item])
        fs.writeFile("./out/"+ item.taleName + '/' +  item.taleName +"Search.jsx", strHtmlSearch, err => {
            if (err) {
                console.log(err)
                throw err
            }
        })
        // 输出modal 文件
        const strHtmlModal = template.render(templateModal,[item])
        fs.writeFile("./out/"+ item.taleName + '/' +  item.taleName +"Modal.jsx", strHtmlModal, err => {
            if (err) {
                console.log(err)
                throw err
            }
        })
    })
    res.send({
        code: 0,
        data: resFiles,
        message: 'success'
    })
});

function getExcelFile(root) {
    let sheets = xlsx.parse(root)
    return new Promise((resolve, reject) => {
        let resultFiles = []
        sheets.forEach(function (sheet) {
            let cellObj = {
                taleName: '',
                tableData: []
            }
            cellObj.taleName = sheet["name"]
            for (let rowId = 1; rowId < sheet['data'].length; rowId++) {
                let row = sheet['data'][rowId];
                if(row.length > 0){
                    cellObj.tableData.push({
                        key: row[0],
                        title: row[1],
                        type: row[2],
                    })
                }
            }
            resultFiles.push(cellObj)
        });
        resolve(resultFiles)
    })
}

function getTemplate(root) {
    return new Promise((resolve, reject) => {
        fs.readFile(root, (err, data) => {
            if (err) {
                reject('readFile failed...')
            }
            resolve(data.toString())
        })
    })
}

function createRootDirect(){
    return new Promise((resolve,reject)=>{
        fs.mkdir('./out',function (err) {
            if(err) return;
            console.info('输出目录创建成功...')
            resolve(true)
        })
    })
}

function createChildrenDirect(resFiles){
    return new Promise((resolve,reject)=>{
        resFiles.forEach(item=>{
            fs.mkdir('./out/'+item.taleName,function (err) {
                if(err){
                    console.error(err)
                    return ;
                }
                console.info('创建子目录'+ item.taleName +'...')
            })
        })
        setTimeout(()=>{
            resolve(true)
        },500)
    })
}

module.exports = router;
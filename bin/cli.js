#! /usr/bin/env node

const program = require('commander')
const path = require("path")
const inquirer = require('inquirer');
const downloadGitRepo = require('download-git-repo')
const ora = require('ora')
const fs = require('fs-extra')
const package = require('../package.json')
const templates = require('./templates.js')

const loading = ora('正在下载模版...')

program
  .command('create')
  .description('创建模板')
  .action(async () => {
    const { name } = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: '请输入项目名称：',
    })
    // 新增选择模版代码
  	const { template } = await inquirer.prompt({
      type: 'list',
      name: 'template',
      message: '请选择模版：',
      choices: templates // 模版列表
    })
    console.log('模版名称：', template, name)

    // 开始下载
    const dirPath =  path.join(process.cwd(), name)
    // 判断文件夹是否存在，存在就交互询问用户是否覆盖
    if(fs.existsSync(dirPath)) {
      const { force } = await inquirer.prompt({
        type: 'confirm',
        name: 'force',
        message: '目录已存在，是否覆盖？',
      })
      // 如果覆盖就删除文件夹继续往下执行，否的话就退出进程
      force ? fs.removeSync(dirPath) : process.exit(1)
    }
    loading.start()
    downloadGitRepo(template, dirPath, function(err) {
      if (err) {
        loading.fail('****创建模版失败：' + err.message)
      } else {
        loading.succeed('****创建模版成功!****')
        console.log(`**\ncd ${projectName}**`)
        console.log('npm i')
        console.log('npm start\n')
      }
    })
  })

// 定义当前版本
program.version(`v${package.version}`)
program.on('--help', () => {})
// 解析用户执行命令传入参数
program.parse(process.argv)
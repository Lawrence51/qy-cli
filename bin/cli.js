#! /usr/bin/env node

const program = require('commander')
const path = require("path")
const inquirer = require('inquirer');
const downloadGitRepo = require('download-git-repo')
const package = require('../package.json')
const templates = require('./templates.js')

// 定义当前版本
program.version(`v${package.version}`)

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
    downloadGitRepo(template, dirPath, function(err) {
      if (err) {
        console.log('****下载失败****', err)
      } else {
        console.log('****下载成功****')
      }
    })
  })

// 解析用户执行命令传入参数
program.parse(process.argv)
console.log('qy-cli')
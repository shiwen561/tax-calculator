@echo off
chcp 65001 >nul
echo ============================================
echo      税务计算助手 - 上传到 GitHub
echo ============================================
echo.

REM 检查 Git 是否安装
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] Git 未安装！
    echo.
    echo 请先下载并安装 Git：
    echo https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git 已安装！
echo.

REM 初始化仓库
if not exist .git (
    echo [1/6] 初始化 Git 仓库...
    git init
    if %errorlevel% neq 0 (
        echo [错误] 初始化失败！
        pause
        exit /b 1
    )
    echo [OK] 初始化成功！
    echo.
) else (
    echo [OK] Git 仓库已存在！
    echo.
)

REM 添加文件
echo [2/6] 添加文件到暂存区...
git add .
echo [OK] 已添加所有文件！
echo.

REM 提交
echo [3/6] 提交更改...
git commit -m "初始提交: 税务计算助手" >nul 2>&1
if %errorlevel% neq 0 (
    echo 没有更改需要提交，继续...
) else (
    echo [OK] 提交成功！
)
echo.

REM 添加远程仓库
echo [4/6] 连接到 GitHub 仓库...
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    git remote add origin https://github.com/shiwen561/-.git
    echo [OK] 远程仓库已添加！
) else (
    git remote set-url origin https://github.com/shiwen561/-.git
    echo [OK] 远程仓库已更新！
)
echo.

REM 检查分支
echo [5/6] 检查分支...
git branch --show-current >nul
if %errorlevel% neq 0 (
    git branch -M main
    echo [OK] 分支设置为 main！
)
echo.

REM 推送到 GitHub
echo [6/6] 推送到 GitHub...
echo.
echo ============================================
echo 正在推送到远程仓库...
echo 如果需要，请输入您的 GitHub 用户名和 Personal Access Token
echo ============================================
echo.
git push -u origin main --force
if %errorlevel% neq 0 (
    echo.
    echo ============================================
    echo [错误] 推送失败！
    echo ============================================
    echo.
    echo 常见问题：
    echo 1. 请检查仓库地址是否正确：https://github.com/shiwen561/-
    echo 2. 请确保已创建 Personal Access Token
    echo    如何获取 Token: https://docs.github.com/cn/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
    echo 3. 输入密码时，请输入您的 Personal Access Token（不是 GitHub 登录密码）
    echo.
) else (
    echo.
    echo ============================================
    echo [成功] 代码已推送到 GitHub！
    echo ============================================
    echo.
    echo 访问地址: https://github.com/shiwen561/-
    echo.
)

echo.
pause

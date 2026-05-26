@echo off
chcp 65001 >nul
echo ============================================
echo      税务计算助手 - 上传到 GitHub
echo ============================================
echo.

REM 设置 GitHub Token（请替换为您自己的 token）
set GH_TOKEN=YOUR_GITHUB_TOKEN_HERE
set GH_USER=shiwen561
set REPO_NAME=-

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
    echo [OK] 初始化成功！
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
echo [OK] 提交完成！
echo.

REM 设置远程仓库
echo [4/6] 连接远程仓库...
git remote add origin https://%GH_USER%:%GH_TOKEN%@github.com/%GH_USER%/%REPO_NAME%.git
echo [OK] 远程仓库已设置！
echo.

REM 推送
echo [5/6] 推送到 GitHub...
echo.
git branch -M main
git push -u origin main
echo.

if %errorlevel% equ 0 (
    echo ============================================
    echo [成功] 代码已推送到 GitHub！
    echo ============================================
    echo.
    echo 访问地址: https://github.com/%GH_USER%/%REPO_NAME%
    echo.
) else (
    echo ============================================
    echo [失败] 推送失败，请检查错误信息
    echo ============================================
)

echo.
pause

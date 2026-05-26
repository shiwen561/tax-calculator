# 税务计算助手 - 上传到 GitHub
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "     税务计算助手 - 上传到 GitHub" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Git 是否安装
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -ne 0) { throw }
    Write-Host "[OK] Git 已安装：$gitVersion" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[错误] Git 未安装！" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先下载并安装 Git：" -ForegroundColor Yellow
    Write-Host "https://git-scm.com/download/win" -ForegroundColor Blue
    Write-Host ""
    Read-Host "按回车键退出"
    exit 1
}

# 初始化仓库
if (-not (Test-Path ".git")) {
    Write-Host "[1/6] 初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 初始化失败！" -ForegroundColor Red
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Host "[OK] 初始化成功！" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[OK] Git 仓库已存在！" -ForegroundColor Green
    Write-Host ""
}

# 添加文件
Write-Host "[2/6] 添加文件到暂存区..." -ForegroundColor Yellow
git add .
Write-Host "[OK] 已添加所有文件！" -ForegroundColor Green
Write-Host ""

# 提交
Write-Host "[3/6] 提交更改..." -ForegroundColor Yellow
git commit -m "初始提交: 税务计算助手" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "没有更改需要提交，继续..." -ForegroundColor Gray
} else {
    Write-Host "[OK] 提交成功！" -ForegroundColor Green
}
Write-Host ""

# 添加远程仓库
Write-Host "[4/6] 连接到 GitHub 仓库..." -ForegroundColor Yellow
git remote get-url origin 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    git remote add origin https://github.com/shiwen561/-.git
    Write-Host "[OK] 远程仓库已添加！" -ForegroundColor Green
} else {
    git remote set-url origin https://github.com/shiwen561/-.git
    Write-Host "[OK] 远程仓库已更新！" -ForegroundColor Green
}
Write-Host ""

# 检查分支
Write-Host "[5/6] 检查分支..." -ForegroundColor Yellow
git branch --show-current 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    git branch -M main
    Write-Host "[OK] 分支设置为 main！" -ForegroundColor Green
}
Write-Host ""

# 推送到 GitHub
Write-Host "[6/6] 推送到 GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "正在推送到远程仓库..." -ForegroundColor Yellow
Write-Host "如果需要，请输入您的 GitHub 用户名和 Personal Access Token" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

git push -u origin main --force

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "[错误] 推送失败！" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "常见问题：" -ForegroundColor Yellow
    Write-Host "1. 请检查仓库地址是否正确：https://github.com/shiwen561/-" -ForegroundColor White
    Write-Host "2. 请确保已创建 Personal Access Token" -ForegroundColor White
    Write-Host "   如何获取 Token: https://docs.github.com/cn/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token" -ForegroundColor Blue
    Write-Host "3. 输入密码时，请输入您的 Personal Access Token（不是 GitHub 登录密码）" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "[成功] 代码已推送到 GitHub！" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "访问地址: https://github.com/shiwen561/-" -ForegroundColor Blue
    Write-Host ""
}

Write-Host ""
Read-Host "按回车键退出"

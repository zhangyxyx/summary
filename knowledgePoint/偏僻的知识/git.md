# github
    * 在git中上传和下载代码的命令
        git clone git的地址 //下载项目
        git add . //上传代码到工作区域
        git commit -m "代码上传的注释" //从工作区域拿到代码文件到git仓库
        git push //上传到仓库中
    * 情况一
        有时候你上传到github之后，可是Contribution并没有显示出来你有提交,造成这种情况可能是你上传到了分支上没有到master上，另一种是你上传的时候邮箱不是当前的；
        分支：合并分支：git merge dev 将dev合并到master
        邮箱：git log 显示一下当前的邮箱，不对的话 git config user.name 你的目标名字    git config user.email 你的目标邮箱名;
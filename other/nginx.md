# nginx
> 前端框架用nginx，怎样配置nginx
1. 在crt找到nginx文件
```
cd ./nginx
cd ./conf
sz nginx.conf //下载文件，端口和根目录文件路径都在这里面配置
```
2. nginx.conf
```
   server {
         listen       8000 ssl;                                   //端口
         server_name  somename  alias  another.alias;
         ssl_certificate /slview/nginx-1.16.0/conf/server.crt;
         ssl_certificate_key /slview/nginx-1.16.0/conf/server.key;
         location / {
            root   html/dist/;                                 //代码所在位置
            index  views/template.html;                        //单页面的html路径
            try_files $uri $uri/ /views/template.html;         //单页面的html路径
        }
   }
```
3. 将前端打包之后的代码放到html中
```
cd ./nginx
cd ./html
rz -xvf dist.tar //将前端打包之后的代码上传到环境中
```
4. 重启nginx
```
cd ./nginx
cd ./sbin
./nginx -s reload //重新加载配置文件
./nginx     //重启nginx
```
>这样端口和页面都配置好了，直接输入ip:端口/views/login

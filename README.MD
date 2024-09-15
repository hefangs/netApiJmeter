## build.xml
```shell
# jmeter.home(直接安装和brew安装的路径不同)
/usr/local/Cellar/jmeter/5.6.3/libexec
```

## jmeter的extras目录中ant-jmeter-1.1.1.jar包拷贝至ant安装目录下的lib目录中
```shell
pwd
/usr/local/Cellar/jmeter/5.6.3/libexec/extras
ll
-rw-r--r--  1 he  admin    11K Jan  2  2024 ant-jmeter-1.1.1.jar
```
```shell
pwd
/usr/local/Cellar/ant/1.10.15/libexec/lib
ll
-rw-r--r--  1 he  admin    11K Jan  2  2024 ant-jmeter-1.1.1.jar
```

## 增加 icon
```shell
# jmeter-results-shanhe-me.xsl 文件的 head 中添加
<link rel="icon" type="image/x-icon" href="./favicon.ico" />
```
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

## 针对不同的执行命令需要改动build.xml文件中的下面 2 行配置
```shell
# ant
# 声明要运行的脚本。"*.jmx"指包含此目录下的所有jmeter脚本
<testplans dir="/Users/he/Documents/local/netApiJmeter" includes="*.jmx" />
# 声明要运行的脚本。"testfile"指包含此目录下的指定的jmeter脚本
# ant -Dtestfile=test1019.jmx 
<testplans dir="/Users/he/Documents/local/netApiJmeter" includes="${testfile}" />
```

## 针对上面的操作简化写法
```shell
<target name="test">
    <taskdef name="jmeter" classname="org.programmerplanet.ant.taskdefs.jmeter.JMeterTask" classpathref="jmeter.classpath"/>
    <!-- 检查是否有传递testfile参数 -->
    <condition property="includes.pattern" value="${testfile}" else="*.jmx">
        <isset property="testfile"/>
    </condition>
    <jmeter jmeterhome="${jmeter.home}" resultlog="${jmeter.result.jtlName}">
        <!-- 动态选择要执行的脚本，根据是否传递testfile参数 -->
        <testplans dir="/Users/he/Documents/local/netApiJmeter" includes="${includes.pattern}" />
        <!-- 声明ant执行jmeter时，传入jmeter的属性值，可以自定义必须是xml格式 -->
        <property name="jmeter.save.saveservice.output_format" value="xml"/>
    </jmeter>
</target>
```
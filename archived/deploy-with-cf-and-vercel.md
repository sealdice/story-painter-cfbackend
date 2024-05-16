# Cloudflare + Vercel 部署

## 限制

1. 免费版本的限制如下：

<img src="../assets/image-20240116212713257.png" alt="image-20240116212713257" style="zoom:50%;" />

这意味着一天大概最多写入1000个日志。我想这个数量应该足够用了。

2. 需要一个域名，要花钱，不如白嫖来的舒服
3. 需要亿定的操作，涉及到编译，部署等相关。同时，你可能需要一个梯子。（部署完成后不需要，主要是Vercel部署部分需要梯子，如果你能自行部署染色器，则无所谓~~没准以后染色器能自己换地址呢~~）

> 如果您几乎是电脑小白，那么下面的教程可能对您有些困难。您或许需要一些技术dalao的帮助。
>
> 如果您本身就是开发者，那下面的东西可能对您没什么难度Orz

## 怎么用

### 提前准备：购买域名

首先注册一个cloudflare账号并绑定一个域名。这里以阿里云为例（可以选择腾讯，百度等其他域名，甚至你可以搜索一下tk免费域名，但一定要是能换绑到cloudflare的）：

首先转到https://wanwang.aliyun.com/domain/ 并登录一个账号。然后在上面搜索你想要的域名名称，比如此处以sealdiceisgood为例：
![image-20240116214413982](../assets/image-20240116214413982.png)

挑选好心仪（便宜）的域名之后直接花钱即可。之后参考：

https://bbs.maozhishi.com/d/56-cloudflare 的方式，将域名换绑到cloudflare。

### 提前准备2：注册Github和Vercel

准备一把趁手的梯子，首先注册一个Github账号。Github地址：https://github.com/ 善用翻译，或者您可以参考：https://zhuanlan.zhihu.com/p/658727572 。

之后利用梯子打开vercel网站：https://www.vercel.com/ ，并使用github登录。登录完成后大概长这样：

![image-20240116215441310](../assets/image-20240116215441310.png)

点击Add New，之后点击Project，然后点击：

![image-20240116215522580](../assets/image-20240116215522580.png)

之后在新出现的界面里，粘贴这个地址后点击continue：https://github.com/sealdice/story-painter.git 

在红色方框处写一个你想的名字后点击Create：

![image-20240116215653749](../assets/image-20240116215653749.png)



此时会这样：

![image-20240116215725087](../assets/image-20240116215725087.png)

等待一会儿后会变成这样：

![image-20240116215922039](../assets/image-20240116215922039.png)

保留这个页面，进行下一步。

## 绑定域名

打开cloudflare，找到你的域名：

![image-20240116220034145](../assets/image-20240116220034145.png)



点击它，然后如图所示展开：

![image-20240116220117507](../assets/image-20240116220117507-1705413678083-1.png)

此时，转回刚刚这个界面：

![image-20240116215922039](../assets/image-20240116215922039.png)

点击Add Domain:

![image-20240116220251448](../assets/image-20240116220251448.png)



如图，xxxx是你自己起的，注意记住，比如我这里以myseal.example.com为例。设置好之后点Add。

第一次必然报错如下：

![image-20240116220407789](../assets/image-20240116220407789.png)

此时转回Cloudflare点Add Record:

![image-20240116220503015](../assets/image-20240116220503015.png)

type选TXT，Name就是那个_vercel，Content是那个第三段内容，之后点Save保存。

回到刚刚的Vercel位置，点Refresh，会出现新报错，如图：

![image-20240116220626383](../assets/image-20240116220626383.png)

照葫芦画瓢，**但是注意，此处有一些不同**

![image-20240116220726454](../assets/image-20240116220726454.png)

完成后再次刷新，此时应该是可用状态，如图：

![image-20240116220804780](../assets/image-20240116220804780.png)

**记住你的地址 myseal.example.com 。我们一会儿就会用上它。**

## 创建Worker

到Cloudflare处，并点击![image-20240116220952620](../assets/image-20240116220952620.png)

以返回。

找到：![image-20240116221010246](../assets/image-20240116221010246.png)

然后点击KV。在此处点击“Create Namespaces"

![image-20240116221042195](../assets/image-20240116221042195.png)

随便起个名（请记住这个名字下面要用），然后点击add：

![image-20240116221112864](../assets/image-20240116221112864.png)

完成后，点击OverView，并点击Create Application:

![image-20240116221156924](../assets/image-20240116221156924.png)

之后点击Create Worker:

![image-20240116221223661](../assets/image-20240116221223661.png)

然后点击Deploy:

![image-20240116221251121](../assets/image-20240116221251121.png)

再点击Edit Code:

![image-20240116221315564](../assets/image-20240116221315564.png)



将本项目的src/worker.js里的内容复制粘贴到新出现的左侧页面里：

![image-20240116221424020](../assets/image-20240116221424020.png)

并将上一个步骤最后的地址，替换url的地址（注意那个斜杠别多了或者少了，以及不要复制两个https……）

比如我们这里的结果是这样的：

![image-20240116221526909](../assets/image-20240116221526909.png)

之后点击右上角的Save And Deploy。之后从左上角

![image-20240116221603971](../assets/image-20240116221603971.png)

这里返回。

接下来转到界面中的Triggers位置：

![image-20240116221637001](../assets/image-20240116221637001.png)

在此处点击：Add Custom Domain

![image-20240116221658960](../assets/image-20240116221658960.png)

在新出现的页面里，输入xxxxxxxxx.你的域名.你的后缀，xxxxxxxxx同样是自己随便起。

![image-20240116221810350](../assets/image-20240116221810350.png)

比如我们这里以这个地址为例(worker.example.com)

完成后点击Add Custom Domain，然后转到Settings：

![image-20240116221920520](../assets/image-20240116221920520.png)

左侧点击Varibles:

![image-20240116221942775](../assets/image-20240116221942775.png)

在右侧找到：![image-20240116221957821](../assets/image-20240116221957821.png)

如图操作，之后点击Save and deploy：

![image-20240116222041855](../assets/image-20240116222041855.png)

接下来您可以访问xxxxxxxxx.你的域名.你的后缀(本例是worker.example.com)，如果没有问题，你将会看到一句话：

![image-20240116222430232](../assets/image-20240116222430232.png)

## 修改源码

首先打开你自己的GitHub，可以看到一个项目（和你Vercel当时命名有关系，忘了请去Vercel看）：

![image](https://github.com/PaienNate/cf_sealdice_logbackend/assets/68044286/920e6c37-6c95-48b5-9c03-d4e1a71adbc7)

点击这个项目进去，依次点击src/store.ts，之后点击那个笔的按钮进行修改:

![image](https://github.com/PaienNate/cf_sealdice_logbackend/assets/68044286/4ebf1ab4-38d5-47a8-9c48-22aadb82f9fd)


将：![image](https://github.com/PaienNate/cf_sealdice_logbackend/assets/68044286/781dd41f-dd4c-489a-9e1b-66119e6df1cc)

修改为：

![image](https://github.com/PaienNate/cf_sealdice_logbackend/assets/68044286/b0371682-a4d9-43b3-8965-6bb40467c801)

(也就是上一大步最后你自己起的地址）

然后点击：![image](https://github.com/PaienNate/cf_sealdice_logbackend/assets/68044286/0cf78254-4391-4ef2-ad0f-f7563732fffa)两次，保存修改。

之后在Vercel里点击Project可以看到正在重新Build,建立成功之后就可以使用了！

![image](https://github.com/PaienNate/cf_sealdice_logbackend/assets/68044286/efb69a6e-949b-4b4c-b7b2-69b03374af41)

（如果不知道怎么看，那简单……等10分钟然后再进行下一步……）

到 https://github.com/sealdice/sealdice-core 来clone一份海豹。之后修改 dice/utils_log_upload.go ，将里面的

```go
var backendUrlsRaw = []string{
	"http://dice.weizaima.com",
}

var BackendUrls = []string{
	"http://dice.weizaima.com",
}
```

修改为你的地址：

```go
var backendUrlsRaw = []string{
	"https://worker.example.com",//注意，http要改成https
}

var BackendUrls = []string{
	"https://worker.example.com",//注意，http要改成https
}
```

然后重新编译的海豹就可以用辣。~~~（什么你问我为什么没有编译教程因为我不会go啊我如果会go我还抓包干啥直接分析源码不就得了什么你问我那编译没教程怎么办我也没办法啊我自己都不会编译呜呜呜）~~

总结：总共要设置两个地址，一个是染色器地址，一个是后端地址。

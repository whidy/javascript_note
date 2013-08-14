# 文件上传插件
### 兼容多浏览器的无需flash的单文件上传工具
### 修改自[iupload.js](https://github.com/dperrymorrow/iupload.js  "iupload.js project")，感谢原作者。

## Change logs

#### 上传增加文件扩展名检查
#### 上传后增加文件名混淆，防止利用[php漏洞](http://zone.wooyun.org/content/1998)进行攻击
#### 在保存文件目录增加htaccess文件（服务器上需修改为名.htaccess）

# 使用方法

## 1. 部署iupload
- 将iupload文件夹拷贝到某目录，示例中为与index.php同一目录

## 2. 设置上传目录
- 修改iupload/upload.php中的设置

````php 
$uploadDir = '../upload_images/';
````

## 3. 引入iupload.js

````php 
<script src="./iupload/i_upload.js" type="text/javascript" ></script>
````

## 4. HTML代码

````php 
  <div class="controls">
  <div id="uploader_image" style="width:220px;height:30px;">
  </div>
  <input type="hidden"  id="image_url" name="image_url">
  <div id="uploader_image_display" style="width:220px;">
  </div>
  </div>
````

## 5. Javascript调用iupload代码

````javascript 
<script type="text/javascript" >
$(function(){
  var uploader_image = new dpm.IUpload( {
    container:'#uploader_image',
    action:"./upload.php",
    iframe_src:"./iupload/iframe.html",
    label:"上传截图"
  } );  

  uploader_image.uploadComplete = function(response){
    if( response.status == "success" ){
    $("#image_url").val(response.file);
    $('#uploader_image_display').html('<img src="'+response.file+'" width="220px" />');
    }else{
    alert(response.message);
    }
  };
});
</script>
````

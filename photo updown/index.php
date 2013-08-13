<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>申请表单</title>
<meta name="description" content="">
<meta name="author" content="">

<!-- HTML5 shim, for IE6-8 support of HTML elements -->
<!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

<!-- Styles -->
<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<style type="text/css">
      /* Override some defaults */
      html, body {
        background-color: #eee;
      }
      body {
        padding-top: 40px; /* 40px to make the container go all the way to the bottom of the topbar */
      }
      .container > footer p {
        text-align: center; /* center align it with the container */
      }

      /* The white background content wrapper */
      .container > .content {
        background-color: #fff;
        padding: 20px;
        margin: 0 -20px; /* negative indent the amount of the padding to maintain the grid system */
        -webkit-border-radius: 0 0 6px 6px;
           -moz-border-radius: 0 0 6px 6px;
                border-radius: 0 0 6px 6px;
        -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.15);
           -moz-box-shadow: 0 1px 2px rgba(0,0,0,.15);
                box-shadow: 0 1px 2px rgba(0,0,0,.15);
      }

      /* Page header tweaks */
      .page-header {
        background-color: #f5f5f5;
        padding: 20px 20px 10px;
        margin: -20px -20px 20px;
      }

      /* Styles you shouldn't keep as they are for displaying this base example only */
      .content .span8,
      .content .span4 {
        min-height: 500px;
      }
      /* Give a quick and non-cross-browser friendly divider */
      .content .span4 {
        margin-left: 0;
        padding-left: 19px;
        border-left: 1px solid #eee;
      }

      .topbar .btn {
        border: 0;
      }
</style>
<link rel="shortcut icon" href="favicon.ico">
</head>

<body>
	<div class="navbar navbar-fixed-top">
		<div class="navbar-inner">

			<div class="container">
				申请表单
			</div>
		</div>
	</div>

	<div class="container">
		<div class="content">

			<div class="row">
				<div class="span12">

			  <form class="form-horizontal" id="apply_form" method="post" action="">
				<fieldset>
				

				<div class="control-group">

					  <!-- Text input-->
					  <label class="control-label" for="site_url">网址</label>
					  <div class="controls">
						<input type="text" placeholder="" class="input-xlarge"  id="site_url" name="site_url">
						<p class="help-block"></p>
					  </div>
					</div>


				<div class="control-group">

					  <!-- Text input-->
					  <label class="control-label" for="site_mgr_name">姓名</label>
					  <div class="controls">
						<input type="text" placeholder="" class="input-xlarge"  id="site_mgr_name" name="site_mgr_name">
						<p class="help-block"></p>
					  </div>
					</div>


				<div class="control-group">
					  <label class="control-label">截图</label>

					  <!-- File Upload -->
			  
					  <div class="controls">
						<div id="uploader_image" style="width:220px;height:30px;">
						</div>
						<input type="hidden"  id="image_url" name="image_url">
						<div id="uploader_image_display" style="width:220px;">
						</div>
					  </div>
					</div>

				<div class="control-group">
					  <label class="control-label"></label>

					  <!-- Button -->
					  <div class="controls">
						<button type="submit" id="submitform" class="btn btn-success">提交</button>
					  </div>
					</div>

				</fieldset>
			  </form>

				</div>
			</div>
		</div>
		<hr />
		<footer>
			<p>
				&copy;
				申请表单
			</p>
		</footer>

	</div>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>!window.jQuery && document.write('<script src="/js/jquery-1.7.1.min.js"></script>');</script>	
<script src="./iupload/i_upload.js" type="text/javascript" ></script>
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
</body>
</html>
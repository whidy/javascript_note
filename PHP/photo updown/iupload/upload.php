<?php
$allowedTypes = array("image/gif","image/jpeg","image/pjpeg","image/png","image/x-png");
$allowedExts = array('jpg','jpeg','gif','bmp','png');

$fieldName = 'iuploadFile';
$uploadDir = '../upload_images/';
$json = array();

$prefix = $_SERVER['HTTP_HOST'].'/'.str_replace( 'upload.php', '', $_SERVER['REQUEST_URI'] ).'/';
$prefix = 'http://'.str_replace('//','/', $prefix);

$org_filename = $_FILES[$fieldName]["name"];
$file_ext = substr(strrchr($org_filename,"."),1); 

//检查扩展名
if(in_array(strtolower($file_ext),$allowedExts)) {
	//检查文件类型(content_type)
	if( in_array(strtolower($_FILES[$fieldName]["type"]), $allowedTypes )){
		if( $_FILES[$fieldName]["error"] > 0 ){
			$json['status'] = 'error';
			$json['message']= $_FILES[$fieldName]["error"];    
		} else {
			//构造文件名
			$file_name = md5(time(). "_" . $_FILES[$fieldName]["name"]) . "." . $file_ext;

			if(move_uploaded_file( $_FILES[$fieldName]["tmp_name"], $uploadDir .  $file_name)){
			  $json['status'] = 'success';
			  $json['file'] = $prefix.$uploadDir . $file_name;
			}else{
			  $json['status'] = 'error';
			  $json['message']= 'could not move uploaded file';
			}
		}	  
	}else{
	  $json['status'] = 'error';
	  $json['message'] = 'File type '. stripslashes($_FILES[$fieldName]["type"]).' is not allowed';
	}
} else {
    $json['status'] = 'error';
    $json['message']= 'invalid file extention';  
}
?>

<script type="text/javascript" charset="utf-8">
  window.response = <?php echo json_encode($json); ?>;
</script>


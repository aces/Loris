<?php
/**
* Quality Control
*
**/ 


if (isset($_GET['action'])){
	$action = $_GET['action'];
	if ($action == "getData"){
		echo "<script>console.log('got data')</script>";
	}
}else{
	error_log("<script> console.log('nodata')</script>");
}
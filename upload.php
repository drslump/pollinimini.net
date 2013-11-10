<?php

$file = $_FILES['logofile'];

$outname = str_replace('/', '_', $file['name']);

move_uploaded_file($file['tmp_name'], dirname(__FILE__) . '/uploads/' . $outname);
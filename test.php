<?php
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';

// We have to mock php://input
// The easiest way is to modify api/chat.php to read from a variable if it's CLI.
// I will just modify api/chat.php temporarily or use a shell script.

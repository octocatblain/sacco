<?php
// Simple logout endpoint to end session and redirect
require_once 'admin_class.php';
$action = new Action();
$action->logout();
exit;

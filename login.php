<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">

	<title>SACCO SHIELD | Project By Mayuri K.</title>


	<?php include('./header.php'); ?>
	<?php include('./db_connect.php'); ?>
	<?php
	session_start();
	if (isset($_SESSION['login_id'])) {
		header("Location: index.php?page=home");
		exit();
	}

	?>
	<!--  Author Name: Mayuri K. 
 for any PHP, Codeignitor, Laravel OR Python work contact me at mayuri.infospace@gmail.com  
 Visit website : www.mayurik.com -->
</head>
<style>
	body {
		width: 100%;
		height: 100vh;
	}

	main#main {
		color: #FFFFFF;
		width: 100%;
		min-height: 100vh;
		position: relative;
		background: url(assets/img/background.jpg);
		background-size: cover;
		background-position: center center;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		justify-content: space-between;
	}

	/* subtle overlay for readability */
	main#main::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.35) 100%);
		pointer-events: none;
	}

	#login-left,
	#login-right {
		position: relative;
		width: 50%;
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding: 2rem;
	}

	#login-left {
		background: #FFFFFF;
		color: #000000;
	}

	#login-right {
		background: rgba(113, 181, 238, 0.10);
		backdrop-filter: blur(2px);
	}

	#login-right .card {
		margin: auto;
		z-index: 1;
		width: 100%;
		max-width: 480px;
		border-radius: 16px;
		box-shadow: 0 16px 32px rgba(0, 0, 0, 0.18);
		border: 1px solid rgba(113, 181, 238, 0.25);
		background: rgba(255, 255, 255, 0.92);
	}

	.logo {
		margin: auto;
		font-size: 8rem;
		background: white;
		border-radius: 50% 50%;
		color: #000000b3;
		z-index: 10;
		text-align: center;
	}
</style>

<body>


	<main id="main" class=" bg-dark">
		<!-- Left: Company Info -->
		<div id="login-left" class="d-flex align-items-center">
			<div class="container">
				<div class="row">
					<div class="col-12 col-lg-10">
						<div class="d-flex align-items-center mb-3">
							<img src="assets/img/logo.png" alt="Logo"
								style="max-width:200px;height:auto;filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">
							<h1 class="ml-3" style="font-weight:700; color:#71B5EE;">SLMS</h1>
						</div>
						<h2 class="mb-2" style="font-weight:700;line-height:1.2;">Savings and Loan<br>Management System
						</h2>
						<p class="lead" style="max-width:680px;color:#eaeaea;">A modern platform for member management,
							savings, loans, and financial reporting designed for SACCOs.</p>
						<div class="mt-4" style="font-weight:600;">SoftClans Technologies Limited</div>
						<div>Nairobi - Kenya</div>
						<div class="mt-2"><a href="https://www.softclans.co.ke" target="_blank"
								style="color:#71B5EE;">www.softclans.co.ke</a></div>
						<div><a href="mailto:sales@softclans.co.ke" style="color:#71B5EE;">sales@softclans.co.ke</a>
						</div>
						<div class="mt-2">+254787611237 • +254115630531 • +254202087923</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right: Login Form -->
		<div id="login-right">
			<div class="card">
				<div class="card-body">
					<div class="logo" style="margin-bottom:1rem;">
						<img src="assets/img/logo.png" width="280px" style="max-width:100%;height:auto;">
					</div>
					<form id="login-form">
						<div class="form-group">
							<label for="username" class="control-label">Username</label>
							<input type="text" id="username" name="username" class="form-control">
						</div>
						<div class="form-group">
							<label for="password" class="control-label">Password</label>
							<div class="input-group">
								<input type="password" id="password" name="password" class="form-control"
									aria-label="Password">
								<div class="input-group-append">
									<button class="btn btn-outline-secondary" type="button" id="togglePassword"
										aria-label="Show/Hide Password">Show</button>
								</div>
							</div>
						</div>
						<center><button class="btn btn-wave col-md-4 btn-primary">Login</button></center>
						<br>
						<div class="text-center" style="font-size:12px;color:#666;">
							Secure access to your SLMS account
						</div>
					</form>
				</div>
			</div>
		</div>

	</main>

	<a href="#" class="back-to-top"><i class="icofont-simple-up"></i></a>



</body>
<script>
	// Toggle password visibility
	$(document).ready(function () {
		$('#togglePassword').on('click', function () {
			const $pwd = $('#password');
			const isText = $pwd.attr('type') === 'text';
			$pwd.attr('type', isText ? 'password' : 'text');
			$(this).text(isText ? 'Show' : 'Hide');
		});
	});

	$('#login-form').submit(function (e) {
		e.preventDefault()
		$('#login-form button').attr('disabled', true).html('Logging in...');
		if ($(this).find('.alert-danger').length > 0)
			$(this).find('.alert-danger').remove();
		$.ajax({
			url: 'ajax.php?action=login',
			method: 'POST',
			data: $(this).serialize(),
			error: err => {
				console.log(err)
				$('#login-form button').removeAttr('disabled').html('Login');

			},
			success: function (resp) {
				if (resp == 1) {
					location.href = 'index.php?page=home';
				} else if (resp == 2) {
					location.href = 'voting.php';
				} else {
					$('#login-form').prepend('<div class="alert alert-danger">Username or password is incorrect.</div>')
					$('#login-form button').removeAttr('disabled').html('Login');
				}
			}
		})
	})
</script>

</html>
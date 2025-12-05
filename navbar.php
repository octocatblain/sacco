<style>
</style>
<nav id="sidebar" class='mx-lt-5 bg-white' aria-label="Primary Navigation">

	<div class="sidebar-list py-2">
		<div class="px-3 py-2" style="font-weight:600;color:#666;border-bottom:1px solid #f0f0f0;">Main</div>

		<!-- Intuitive order: Home → Borrowers → Loans → Payments → Plans → Types -->
		<a href="index.php?page=home" class="nav-item nav-home"><span class='icon-field'><i
					class="fa fa-home"></i></span> Home</a>
		<a href="index.php?page=borrowers" class="nav-item nav-borrowers"><span class='icon-field'><i
					class="fa fa-user-friends"></i></span> Borrowers</a>
		<a href="index.php?page=loans" class="nav-item nav-loans"><span class='icon-field'><i
					class="fa fa-file-invoice-dollar"></i></span> Loans</a>
		<a href="index.php?page=payments" class="nav-item nav-payments"><span class='icon-field'><i
					class="fa fa-money-bill"></i></span> Payments</a>
		<div class="px-3 py-2 mt-3" style="font-weight:600;color:#666;border-top:1px solid #f0f0f0;">Configuration</div>
		<a href="index.php?page=plan" class="nav-item nav-plan"><span class='icon-field'><i
					class="fa fa-list-alt"></i></span> Loan Plans</a>
		<a href="index.php?page=loan_type" class="nav-item nav-loan_type"><span class='icon-field'><i
					class="fa fa-th-list"></i></span> Loan Types</a>
		<?php if ($_SESSION['login_type'] == 1): ?>
			<div class="px-3 py-2 mt-3" style="font-weight:600;color:#666;border-top:1px solid #f0f0f0;">Administration
			</div>
			<a href="index.php?page=users" class="nav-item nav-users"><span class='icon-field'><i
						class="fa fa-users"></i></span> Users</a>
		<?php endif; ?>
	</div>

</nav>
<script>
	$('.nav-<?php echo isset($_GET['page']) ? $_GET['page'] : '' ?>').addClass('active')
</script>
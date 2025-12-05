<style>
	.logo {
		margin: auto;
		font-size: 35px;
		/* background: white;
	padding: 7px 11px;
	border-radius: 50% 50%;
	color: #000000b3;*/
	}

	.logo img {
		max-width: 160px;
		height: auto;
	}
</style>

<div id="page"></div>
<div id="loading"></div>
<nav class="navbar navbar-light fixed-top" style="padding:0;">
	<div class="container-fluid mt-2 mb-2">
		<div class="d-flex align-items-center justify-content-between w-100">
			<!-- Left: Logo -->
			<div class="d-flex align-items-center">
				<div class="logo d-flex align-items-center">
					<img src="assets/img/logo.png" alt="Logo">
					<span class="ml-2" style="font-weight:700;color:#71B5EE;letter-spacing:0.5px;">SLMS</span>
				</div>
			</div>

			<!-- Right: Profile dropdown -->
			<div class="d-flex align-items-center">
				<div class="dropdown">
					<a class="d-flex align-items-center text-dark dropdown-toggle" href="#" id="profileDropdown"
						data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<img src="assets/img/profile.png" alt="Profile"
							style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #71B5EE;"
							onerror="this.src='assets/img/no-img.jpg'">
						<span class="ml-2">Profile</span>
					</a>
					<div class="dropdown-menu dropdown-menu-right" aria-labelledby="profileDropdown">
						<a class="dropdown-item" href="index.php?page=users">My Profile</a>
						<div class="dropdown-divider"></div>
						<a class="dropdown-item text-danger" href="logout.php">Logout</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</nav>
<script>
	(function () {
		var $trigger = $('#profileDropdown');
		var $menu = $trigger.next('.dropdown-menu');

		// If Bootstrap's dropdown plugin is available, initialize it
		if ($.fn && $.fn.dropdown) {
			$trigger.dropdown();
		} else {
			// Fallback: toggle .show manually on click
			$trigger.on('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				$menu.toggleClass('show');
				$menu.attr('aria-labelledby', 'profileDropdown');
			});

			// Close when clicking outside
			$(document).on('click', function () {
				$menu.removeClass('show');
			});
		}

		// Also toggle when clicking directly on the image inside the trigger
		$trigger.find('img').on('click', function (e) {
			e.preventDefault();
			e.stopPropagation();
			if ($.fn && $.fn.dropdown) {
				$trigger.dropdown('toggle');
			} else {
				$menu.toggleClass('show');
			}
		});
	})();
</script>
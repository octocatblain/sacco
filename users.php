<?php

?>

<?php include 'db_connect.php';
include 'admin_class.php';
if (!Action::hasPermission('manage_users')) {
	die('Forbidden');
} ?>


<div class="container-fluid">
	<div class="col-lg-12">
		<div class="card">
			<div class="card-header d-flex justify-content-between align-items-center">
				<div>
					<div class="card-title mb-0"><b>Users</b></div>
					<small class="text-muted">Manage application users and access</small>
				</div>
				<div>
					<button class="btn btn-primary" id="new_user"><i class="fa fa-plus"></i> New user</button>
				</div>
			</div>
			<div class="card-body">
				<div class="table-responsive">
					<table class="table table-striped table-bordered">
						<thead>
							<tr>
								<th class="text-center">#</th>
								<th class="text-center">Name</th>
								<th class="text-center">Username</th>
								<th class="text-center">Email</th>
								<th class="text-center">Phone</th>
								<th class="text-center">Role</th>
								<th class="text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							<?php
							$users = $conn->query("SELECT id, name, username, email, phone, role FROM users ORDER BY name ASC");
							$i = 1;
							while ($row = $users->fetch_assoc()):
								?>
								<tr>
									<td>
										<?php echo $i++ ?>
									</td>
									<td>
										<?php echo $row['name'] ?>
									</td>
									<td>
										<?php echo $row['username'] ?>
									<td>
										<?php echo isset($row['email']) ? $row['email'] : '' ?>
									</td>
									<td>
										<?php echo isset($row['phone']) ? $row['phone'] : '' ?>
									</td>
									<td>
										<?php echo isset($row['role']) ? $row['role'] : '' ?>
									</td>
									<td>
										<center>
											<div class="btn-group">
												<button type="button" class="btn btn-primary dropdown-toggle"
													data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
													Action
												</button>
												<div class="dropdown-menu">
													<a class="dropdown-item edit_user" href="javascript:void(0)"
														data-id='<?php echo $row['id'] ?>'>Edit</a>
													<div class="dropdown-divider"></div>
													<a class="dropdown-item delete_user" href="javascript:void(0)"
														data-id='<?php echo $row['id'] ?>'>Delete</a>
												</div>
											</div>
										</center>
									</td>
								</tr>
							<?php endwhile; ?>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>

</div>
<script>

	$('#new_user').click(function () {
		uni_modal('New User', 'manage_user.php')
	})
	$('.edit_user').click(function () {
		uni_modal('Edit User', 'manage_user.php?id=' + $(this).attr('data-id'))
	})
	$('.delete_user').click(function () {
		_conf("Are you sure to delete this user?", "delete_user", [$(this).attr('data-id')])
	})
	function delete_user($id) {
		start_load()
		$.ajax({
			url: 'ajax.php?action=delete_user',
			method: 'POST',
			data: { id: $id },
			success: function (resp) {
				if (resp == 1) {
					alert_toast("Data successfully deleted", 'success')
					setTimeout(function () {
						location.reload()
					}, 1500)

				}
			}
		})
	}
</script>
<?php include 'db_connect.php' ?>
<style>

</style>

<div class="container-fluid">
    <div class="col-lg-12">
        <!-- KPI Row -->
        <div class="row mt-3">
            <div class="col-md-3">
                <div class="card mb-3" style="border-left:4px solid #71B5EE;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="text-muted">Payments Today</div>
                                <div class="h4 font-weight-bold mb-0">
                                    <?php
                                    $payments = $conn->query("SELECT sum(amount) as total FROM payments where date_created::date = '" . date("Y-m-d") . "'");
                                    echo $payments->num_rows > 0 ? number_format($payments->fetch_array()['total'], 2) : "0.00";
                                    ?>
                                </div>
                            </div>
                            <div class="text-primary"><i class="fa fa-money-bill fa-2x"></i></div>
                        </div>
                    </div>
                    <div class="card-footer d-flex align-items-center justify-content-between">
                        <a class="stretched-link" href="index.php?page=payments">View Payments</a>
                    </div>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card mb-3" style="border-left:4px solid #28a745;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="text-muted">Borrowers</div>
                                <div class="h4 font-weight-bold mb-0">
                                    <?php
                                    $borrowers = $conn->query("SELECT * FROM borrowers");
                                    echo $borrowers->num_rows > 0 ? $borrowers->num_rows : "0";
                                    ?>
                                </div>
                            </div>
                            <div class="text-success"><i class="fa fa-user-friends fa-2x"></i></div>
                        </div>
                    </div>
                    <div class="card-footer d-flex align-items-center justify-content-between">
                        <a class="stretched-link" href="index.php?page=borrowers">View Borrowers</a>
                    </div>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card mb-3" style="border-left:4px solid #ffc107;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="text-muted">Active Loans</div>
                                <div class="h4 font-weight-bold mb-0">
                                    <?php
                                    $loans = $conn->query("SELECT * FROM loan_list where status = 2");
                                    echo $loans->num_rows > 0 ? $loans->num_rows : "0";
                                    ?>
                                </div>
                            </div>
                            <div class="text-warning"><i class="fa fa-file-invoice-dollar fa-2x"></i></div>
                        </div>
                    </div>
                    <div class="card-footer d-flex align-items-center justify-content-between">
                        <a class="stretched-link" href="index.php?page=loans">View Loans</a>
                    </div>
                </div>
            </div>

            <div class="col-md-3">
                <div class="card mb-3" style="border-left:4px solid #17a2b8;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <div class="text-muted">Total Receivable</div>
                                <div class="h4 font-weight-bold mb-0">
                                    <?php
                                    $paymentsToday = $conn->query("SELECT sum(amount - penalty_amount) as total FROM payments where date_created::date = '" . date("Y-m-d") . "'");
                                    $loansTotal = $conn->query("SELECT sum(l.amount + (l.amount * (p.interest_percentage/100))) as total FROM loan_list l inner join loan_plan p on p.id = l.plan_id where l.status = 2");
                                    $loansTotal = $loansTotal->num_rows > 0 ? $loansTotal->fetch_array()['total'] : "0";
                                    $paymentsToday = $paymentsToday->num_rows > 0 ? $paymentsToday->fetch_array()['total'] : "0";
                                    echo number_format((float) $loansTotal - (float) $paymentsToday, 2);
                                    ?>
                                </div>
                            </div>
                            <div class="text-info"><i class="fa fa-chart-line fa-2x"></i></div>
                        </div>
                    </div>
                    <div class="card-footer d-flex align-items-center justify-content-between">
                        <a class="stretched-link" href="index.php?page=loans">View Loans</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Payments Table -->
        <div class="card mt-4">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <b class="h5 mb-0">Recent Payments</b>
                    <a href="index.php?page=payments" class="btn btn-sm btn-outline-primary">Go to Payments</a>
                </div>
                <table class="table table-bordered table-hover" id="loan-list">
                    <colgroup>
                        <col width="5%">
                        <col width="20%">
                        <col width="25%">
                        <col width="20%">
                        <col width="15%">
                        <col width="15%">
                    </colgroup>
                    <thead class="thead-light">
                        <tr>
                            <th class="text-center">#</th>
                            <th class="text-center">Reference No</th>
                            <th class="text-center">Payee</th>
                            <th class="text-center">Amount</th>
                            <th class="text-center">Penalty</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $i = 1;
                        $qry = $conn->query("SELECT p.*, l.ref_no, concat(b.lastname,', ',b.firstname,' ',b.middlename) as name, b.contact_no, b.address FROM payments p INNER JOIN loan_list l ON l.id = p.loan_id INNER JOIN borrowers b ON b.id = l.borrower_id ORDER BY p.id DESC LIMIT 20");
                        while ($row = $qry->fetch_assoc()):
                            ?>
                            <tr>
                                <td class="text-center"><?php echo $i++ ?></td>
                                <td><?php echo $row['ref_no'] ?></td>
                                <td><?php echo $row['payee'] ?></td>
                                <td class="text-right"><?php echo number_format($row['amount'], 2) ?></td>
                                <td class="text-right"><?php echo number_format($row['penalty_amount'], 2) ?></td>
                                <td class="text-center">
                                    <button class="btn btn-primary btn-sm edit_payment" type="button"
                                        data-id="<?php echo $row['id'] ?>"><i class="fa fa-edit"></i></button>
                                    <button class="btn btn-danger btn-sm delete_payment" type="button"
                                        data-id="<?php echo $row['id'] ?>"><i class="fa fa-trash"></i></button>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
## How to use RBAC

Check permissions in pages/actions, for example:
`<?php if (!Action::hasPermission('manage_users')) { die('Forbidden'); }`

## Security Changes

Added RBAC guards to key pages so only authorized roles can access them.

Updates

- users.php: Requires manage_users permission.
- loans.php: Requires manage_loans permission.
- payments.php: Requires manage_payments permission.

Implementation

- Each page now includes admin_class.php and calls Action::hasPermission(...). If false, it returns “Forbidden”.
- Roles mapped in Action::hasPermission:
  - type=1 (admin): manage_users, manage_loans, manage_payments, view_reports, manage_settings
  - type=2 (staff): manage_loans, manage_payments, view_reports
  - type=3 (member): view_self, apply_loan, view_payments

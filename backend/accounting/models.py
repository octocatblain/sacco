from __future__ import annotations
from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


class Account(models.Model):
    class Type(models.TextChoices):
        ASSET = "ASSET", "Asset"
        LIABILITY = "LIABILITY", "Liability"
        EQUITY = "EQUITY", "Equity"
        INCOME = "INCOME", "Income"
        EXPENSE = "EXPENSE", "Expense"

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=120)
    type = models.CharField(max_length=16, choices=Type.choices)
    parent = models.ForeignKey(
        "self", on_delete=models.PROTECT, null=True, blank=True, related_name="children"
    )
    is_active = models.BooleanField(default=True)
    currency = models.CharField(max_length=8, default="KES")

    class Meta:
        ordering = ["code"]
        constraints = [
            models.UniqueConstraint(fields=["code"], name="uq_account_code"),
        ]

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.code} - {self.name}"


class JournalEntry(models.Model):
    date = models.DateField(default=timezone.now)
    reference = models.CharField(max_length=64, blank=True)
    narration = models.TextField(blank=True)
    posted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-id"]

    def clean(self):
        debit = sum(line.debit for line in self.lines.all())
        credit = sum(line.credit for line in self.lines.all())
        if round(debit - credit, 2) != 0:
            raise ValidationError("Journal not balanced: debits must equal credits")
        if any((line.debit < 0 or line.credit < 0) for line in self.lines.all()):
            raise ValidationError("Debit/Credit cannot be negative")

    def post(self):
        # Placeholder for posting hooks; we persist lines as ledger
        self.posted = True
        self.save(update_fields=["posted"])


class JournalLine(models.Model):
    entry = models.ForeignKey(
        JournalEntry, on_delete=models.CASCADE, related_name="lines"
    )
    account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="lines")
    memo = models.CharField(max_length=160, blank=True)
    debit = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    class Meta:
        ordering = ["id"]

    def clean(self):
        if self.debit and self.credit:
            raise ValidationError("A line cannot have both debit and credit")
        if (self.debit or 0) < 0 or (self.credit or 0) < 0:
            raise ValidationError("Debit/Credit cannot be negative")
        if not self.debit and not self.credit:
            raise ValidationError("Either debit or credit must be entered")


class AccountingPeriod(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    is_closed = models.BooleanField(default=False)
    closed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-start_date"]
        constraints = [
            models.CheckConstraint(
                check=models.Q(end_date__gte=models.F("start_date")),
                name="ck_period_dates",
            )
        ]


class BankReconciliation(models.Model):
    account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name="reconciliations")
    statement_date = models.DateField()
    statement_balance = models.DecimalField(max_digits=14, decimal_places=2)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-statement_date"]

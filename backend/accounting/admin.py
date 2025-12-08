from django.contrib import admin
from .models import Account, JournalEntry, JournalLine, AccountingPeriod, BankReconciliation


class JournalLineInline(admin.TabularInline):
    model = JournalLine
    extra = 0


@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ("id", "date", "reference", "posted")
    list_filter = ("posted", "date")
    inlines = [JournalLineInline]


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "type", "is_active")
    list_filter = ("type", "is_active")
    search_fields = ("code", "name")


@admin.register(AccountingPeriod)
class AccountingPeriodAdmin(admin.ModelAdmin):
    list_display = ("start_date", "end_date", "is_closed")
    list_filter = ("is_closed",)


@admin.register(BankReconciliation)
class BankReconciliationAdmin(admin.ModelAdmin):
    list_display = ("account", "statement_date", "statement_balance")
    list_filter = ("statement_date",)

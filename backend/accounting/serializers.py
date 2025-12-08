from rest_framework import serializers
from .models import Account, JournalEntry, JournalLine, AccountingPeriod, BankReconciliation


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ["id", "code", "name", "type", "parent", "is_active", "currency"]


class JournalLineSerializer(serializers.ModelSerializer):
    account_detail = AccountSerializer(source="account", read_only=True)

    class Meta:
        model = JournalLine
        fields = ["id", "account", "account_detail", "memo", "debit", "credit"]


class JournalEntrySerializer(serializers.ModelSerializer):
    lines = JournalLineSerializer(many=True)

    class Meta:
        model = JournalEntry
        fields = [
            "id",
            "date",
            "reference",
            "narration",
            "posted",
            "created_at",
            "updated_at",
            "lines",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def validate(self, data):
        lines = data.get("lines") or []
        debit = sum([float(l.get("debit") or 0) for l in lines])
        credit = sum([float(l.get("credit") or 0) for l in lines])
        if round(debit - credit, 2) != 0:
            raise serializers.ValidationError("Journal not balanced: debits must equal credits")
        return data

    def create(self, validated_data):
        lines_data = validated_data.pop("lines", [])
        entry = JournalEntry.objects.create(**validated_data)
        for l in lines_data:
            JournalLine.objects.create(entry=entry, **l)
        return entry

    def update(self, instance, validated_data):
        lines_data = validated_data.pop("lines", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if lines_data is not None:
            instance.lines.all().delete()
            for l in lines_data:
                JournalLine.objects.create(entry=instance, **l)
        return instance


class AccountingPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountingPeriod
        fields = ["id", "start_date", "end_date", "is_closed", "closed_at"]


class BankReconciliationSerializer(serializers.ModelSerializer):
    account_detail = AccountSerializer(source="account", read_only=True)

    class Meta:
        model = BankReconciliation
        fields = [
            "id",
            "account",
            "account_detail",
            "statement_date",
            "statement_balance",
            "notes",
            "created_at",
        ]
        read_only_fields = ["created_at"]

from django.db.models import Sum, F, Value
from django.db.models.functions import Coalesce
from rest_framework import viewsets, decorators, response
from .models import Account, JournalEntry, JournalLine, AccountingPeriod, BankReconciliation
from .serializers import (
    AccountSerializer,
    JournalEntrySerializer,
    AccountingPeriodSerializer,
    BankReconciliationSerializer,
)


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all().select_related("parent")
    serializer_class = AccountSerializer


class JournalEntryViewSet(viewsets.ModelViewSet):
    queryset = JournalEntry.objects.all().prefetch_related("lines__account")
    serializer_class = JournalEntrySerializer

    @decorators.action(detail=False, methods=["get"], url_path="trial-balance")
    def trial_balance(self, request):
        start = request.query_params.get("start")
        end = request.query_params.get("end")
        q = JournalLine.objects.filter(entry__posted=True)
        if start:
            q = q.filter(entry__date__gte=start)
        if end:
            q = q.filter(entry__date__lte=end)
        agg = (
            q.values("account__id", "account__code", "account__name", "account__type")
            .annotate(
                debit=Coalesce(Sum("debit"), Value(0.0)),
                credit=Coalesce(Sum("credit"), Value(0.0)),
                balance=F("debit") - F("credit"),
            )
            .order_by("account__code")
        )
        return response.Response(list(agg))

    @decorators.action(detail=False, methods=["post"], url_path="post")
    def post_entries(self, request):
        ids = request.data.get("ids", [])
        for entry in JournalEntry.objects.filter(id__in=ids):
            entry.post()
        return response.Response({"posted": len(ids)})


class AccountingPeriodViewSet(viewsets.ModelViewSet):
    queryset = AccountingPeriod.objects.all()
    serializer_class = AccountingPeriodSerializer


class BankReconciliationViewSet(viewsets.ModelViewSet):
    queryset = BankReconciliation.objects.all().select_related("account")
    serializer_class = BankReconciliationSerializer

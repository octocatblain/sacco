from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AccountViewSet, JournalEntryViewSet, AccountingPeriodViewSet, BankReconciliationViewSet

router = DefaultRouter()
router.register(r'accounts', AccountViewSet, basename='account')
router.register(r'journals', JournalEntryViewSet, basename='journal')
router.register(r'periods', AccountingPeriodViewSet, basename='period')
router.register(r'bank-reconciliations', BankReconciliationViewSet, basename='bankrecon')

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path, include
from rest_framework import routers

from .views import CustomerViewSet, AccountViewSet, TransactionViewSet, LoanViewSet

router = routers.DefaultRouter()
# Expose endpoints under /api/customers/
router.register(r'customers', CustomerViewSet, basename='customers')
router.register(r'accounts', AccountViewSet, basename='accounts')
router.register(r'transactions', TransactionViewSet, basename='transactions')
router.register(r'loans', LoanViewSet, basename='loans')

urlpatterns = [
	path('', include(router.urls)),
]

from django.urls import path, include
from rest_framework import routers

from .views import CustomerViewSet, AccountViewSet, TransactionViewSet, LoanViewSet

router = routers.DefaultRouter()
# Expose customer list/detail at /api/customers/
router.register(r'', CustomerViewSet, basename='customers')
# Additional resources under /api/customers/
router.register(r'accounts', AccountViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'loans', LoanViewSet)

urlpatterns = [
	path('', include(router.urls)),
]

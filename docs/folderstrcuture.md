enterprise-saas-app/ ├── 📁 src/ │ ├── 📁 app/ # Next.js 15 App Router │ │ ├──
📁 (public)/ # Public routes group │ │ │ ├── 📁 landing/ │ │ │ │ ├── page.tsx │
│ │ │ ├── loading.tsx │ │ │ │ └── layout.tsx │ │ │ ├── 📁 pricing/ │ │ │ │ ├──
page.tsx │ │ │ │ └── components/ │ │ │ ├── 📁 features/ │ │ │ ├── 📁 about/ │ │
│ ├── 📁 contact/ │ │ │ ├── 📁 blog/ │ │ │ │ ├── page.tsx │ │ │ │ └── 📁 [slug]/
│ │ │ ├── 📁 legal/ │ │ │ │ ├── 📁 privacy/ │ │ │ │ ├── 📁 terms/ │ │ │ │ └── 📁
cookies/ │ │ │ └── layout.tsx │ │ ├── 📁 (auth)/ # Authentication routes group │
│ │ ├── 📁 login/ │ │ │ │ ├── page.tsx │ │ │ │ └── components/ │ │ │ ├── 📁
register/ │ │ │ ├── 📁 forgot-password/ │ │ │ ├── 📁 reset-password/ │ │ │ ├──
📁 verify-email/ │ │ │ ├── 📁 sso/ │ │ │ │ └── 📁 [provider]/ │ │ │ └──
layout.tsx # Auth-specific layout │ │ ├── 📁 (dashboard)/ # Protected dashboard
group │ │ │ ├── 📁 overview/ # Main dashboard │ │ │ │ ├── page.tsx │ │ │ │ └──
components/ │ │ │ ├── 📁 [core-feature-1]/ # Replace with main feature (e.g.,
projects) │ │ │ │ ├── page.tsx │ │ │ │ ├── loading.tsx │ │ │ │ ├── error.tsx │ │
│ │ ├── 📁 [id]/ │ │ │ │ │ ├── page.tsx │ │ │ │ │ ├── 📁 edit/ │ │ │ │ │ └── 📁
settings/ │ │ │ │ ├── 📁 create/ │ │ │ │ └── 📁 components/ │ │ │ ├── 📁
[core-feature-2]/ # Replace with secondary feature (e.g., tasks) │ │ │ │ └──
... # Same structure as above │ │ │ ├── 📁 users/ # User management │ │ │ │ ├──
page.tsx │ │ │ │ ├── 📁 [userId]/ │ │ │ │ ├── 📁 roles/ │ │ │ │ ├── 📁 invite/ │
│ │ │ └── components/ │ │ │ ├── 📁 analytics/ # Analytics & reporting │ │ │ │
├── page.tsx │ │ │ │ ├── 📁 reports/ │ │ │ │ ├── 📁 metrics/ │ │ │ │ └──
components/ │ │ │ ├── 📁 settings/ # Settings & configuration │ │ │ │ ├──
page.tsx │ │ │ │ ├── 📁 profile/ │ │ │ │ ├── 📁 billing/ │ │ │ │ │ ├── page.tsx
│ │ │ │ │ ├── 📁 subscription/ │ │ │ │ │ ├── 📁 invoices/ │ │ │ │ │ └── 📁
payment-methods/ │ │ │ │ ├── 📁 team/ │ │ │ │ ├── 📁 integrations/ │ │ │ │ ├──
📁 security/ │ │ │ │ ├── 📁 preferences/ │ │ │ │ └── 📁 api-keys/ │ │ │ └──
layout.tsx # Dashboard layout │ │ ├── 📁 (admin)/ # Admin routes group │ │ │ ├──
📁 tenants/ │ │ │ ├── 📁 system/ │ │ │ ├── 📁 monitoring/ │ │ │ └── layout.tsx │
│ ├── 📁 (widget)/ # Embeddable widget routes (optional) │ │ │ ├── 📁 embed/ │ │
│ │ ├── 📁 [tenantId]/ │ │ │ │ └── page.tsx │ │ │ ├── 📁 preview/ │ │ │ └──
layout.tsx # Minimal widget layout │ │ ├── 📁 api/ # API Routes with tenant
isolation │ │ │ ├── 📁 auth/ │ │ │ │ ├── route.ts │ │ │ │ ├── 📁 signin/ │ │ │ │
├── 📁 signup/ │ │ │ │ ├── 📁 signout/ │ │ │ │ ├── 📁 session/ │ │ │ │ └── 📁
[...nextauth]/ │ │ │ ├── 📁 [core-feature-1]/ # Replace with your API endpoints
│ │ │ │ ├── route.ts │ │ │ │ └── 📁 [id]/ │ │ │ ├── 📁 [core-feature-2]/ │ │ │ │
└── ... │ │ │ ├── 📁 users/ │ │ │ │ ├── route.ts │ │ │ │ ├── 📁 [userId]/ │ │ │
│ ├── 📁 invite/ │ │ │ │ └── 📁 roles/ │ │ │ ├── 📁 analytics/ │ │ │ │ ├── 📁
metrics/ │ │ │ │ ├── 📁 reports/ │ │ │ │ └── 📁 events/ │ │ │ ├── 📁 billing/ │
│ │ │ ├── route.ts │ │ │ │ ├── 📁 subscription/ │ │ │ │ ├── 📁 invoices/ │ │ │ │
├── 📁 usage/ │ │ │ │ └── 📁 stripe/ │ │ │ │ ├── 📁 webhooks/ │ │ │ │ ├── 📁
checkout/ │ │ │ │ └── 📁 portal/ │ │ │ ├── 📁 integrations/ # Third-party
integrations │ │ │ │ ├── 📁 webhooks/ │ │ │ │ ├── 📁 oauth/ │ │ │ │ └── 📁
api-keys/ │ │ │ ├── 📁 admin/ # Admin APIs │ │ │ │ ├── 📁 tenants/ │ │ │ │ ├──
📁 system/ │ │ │ │ └── 📁 monitoring/ │ │ │ ├── 📁 tenants/ │ │ │ │ ├── route.ts
│ │ │ │ └── 📁 [tenantId]/ │ │ │ ├── 📁 health/ │ │ │ │ └── route.ts │ │ │ └──
📁 cron/ │ │ │ ├── 📁 cleanup/ │ │ │ ├── 📁 reports/ │ │ │ └── 📁 billing/ │ │
├── 📁 globals.css │ │ ├── 📁 layout.tsx # Root layout │ │ ├── 📁 page.tsx #
Homepage redirect │ │ ├── 📁 loading.tsx # Global loading UI │ │ ├── 📁
error.tsx # Global error UI │ │ ├── 📁 not-found.tsx # 404 page │ │ ├── 📁
robots.ts # SEO robots │ │ ├── 📁 sitemap.ts # SEO sitemap │ │ └── 📁
manifest.ts # PWA manifest │ ├── 📁 modules/ # Feature-based modules (Core
Business Logic) │ │ ├── 📁 auth/ │ │ │ ├── 📁 components/ │ │ │ │ ├── 📁 forms/
│ │ │ │ │ ├── LoginForm.tsx │ │ │ │ │ ├── RegisterForm.tsx │ │ │ │ │ ├──
ForgotPasswordForm.tsx │ │ │ │ │ └── ResetPasswordForm.tsx │ │ │ │ ├── 📁
providers/ │ │ │ │ │ ├── GoogleButton.tsx │ │ │ │ │ ├── GitHubButton.tsx │ │ │ │
│ └── SSOButton.tsx │ │ │ │ ├── 📁 guards/ │ │ │ │ │ ├── AuthGuard.tsx │ │ │ │ │
├── GuestGuard.tsx │ │ │ │ │ └── RoleGuard.tsx │ │ │ │ └── EmailVerification.tsx
│ │ │ ├── 📁 hooks/ │ │ │ │ ├── 📁 queries/ │ │ │ │ │ ├── useCurrentUser.ts │ │
│ │ │ └── useSession.ts │ │ │ │ ├── 📁 mutations/ │ │ │ │ │ ├── useLogin.ts │ │
│ │ │ ├── useRegister.ts │ │ │ │ │ └── useLogout.ts │ │ │ │ ├── useAuth.ts │ │ │
│ ├── useTenant.ts │ │ │ │ └── usePermissions.ts │ │ │ ├── 📁 services/ │ │ │ │
├── 📁 api/ │ │ │ │ │ ├── authApi.ts │ │ │ │ │ └── tenantApi.ts │ │ │ │ ├── 📁
business/ │ │ │ │ │ ├── authService.ts │ │ │ │ │ ├── tenantService.ts │ │ │ │ │
└── permissionService.ts │ │ │ │ └── 📁 external/ │ │ │ │ ├── emailService.ts │
│ │ │ └── smsService.ts │ │ │ ├── 📁 store/ │ │ │ │ ├── authStore.ts │ │ │ │ ├──
auth.selectors.ts │ │ │ │ └── auth.actions.ts │ │ │ ├── 📁 types/ │ │ │ │ ├──
api.types.ts │ │ │ │ ├── domain.types.ts │ │ │ │ └── ui.types.ts │ │ │ ├── 📁
utils/ │ │ │ │ ├── validation.ts │ │ │ │ ├── tokenHelpers.ts │ │ │ │ ├──
encryption.ts │ │ │ │ └── constants.ts │ │ │ ├── 📁 config/ │ │ │ │ ├──
routes.ts │ │ │ │ ├── permissions.ts │ │ │ │ └── defaults.ts │ │ │ └── 📁
**tests**/ │ │ │ ├── 📁 components/ │ │ │ ├── 📁 hooks/ │ │ │ ├── 📁 services/ │
│ │ └── 📁 integration/ │ │ ├── 📁 user-management/ │ │ │ └── ... # Same
detailed structure │ │ ├── 📁 [core-feature-1]/ # Replace with main feature
(e.g., projects, campaigns) │ │ │ ├── 📁 components/ │ │ │ │ ├── 📁 forms/ │ │ │
│ │ ├── CreateForm.tsx │ │ │ │ │ ├── EditForm.tsx │ │ │ │ │ └── SearchForm.tsx │
│ │ │ ├── 📁 lists/ │ │ │ │ │ ├── FeatureList.tsx │ │ │ │ │ ├── FeatureGrid.tsx
│ │ │ │ │ └── FeatureTable.tsx │ │ │ │ ├── 📁 details/ │ │ │ │ │ ├──
FeatureDetail.tsx │ │ │ │ │ ├── FeaturePreview.tsx │ │ │ │ │ └──
FeatureStats.tsx │ │ │ │ └── 📁 modals/ │ │ │ │ ├── DeleteModal.tsx │ │ │ │ ├──
ShareModal.tsx │ │ │ └── SettingsModal.tsx │ │ │ ├── 📁 hooks/ │ │ │ │ ├── 📁
queries/ │ │ │ │ │ ├── useFeature.ts │ │ │ │ │ ├── useFeatureList.ts │ │ │ │ │
└── useFeatureStats.ts │ │ │ │ ├── 📁 mutations/ │ │ │ │ │ ├──
useCreateFeature.ts │ │ │ │ │ ├── useUpdateFeature.ts │ │ │ │ │ └──
useDeleteFeature.ts │ │ │ │ └── 📁 effects/ │ │ │ │ ├── useFeatureSync.ts │ │ │
│ └── useFeatureCache.ts │ │ │ ├── 📁 services/ │ │ │ │ ├── 📁 api/ │ │ │ │ │
└── featureApi.ts │ │ │ │ ├── 📁 business/ │ │ │ │ │ ├── featureService.ts │ │ │
│ │ └── validationService.ts │ │ │ │ └── 📁 external/ │ │ │ │ └──
integrationService.ts │ │ │ ├── 📁 store/ │ │ │ │ ├── featureStore.ts │ │ │ │
├── feature.selectors.ts │ │ │ │ └── feature.actions.ts │ │ │ ├── 📁 types/ │ │
│ │ ├── api.types.ts │ │ │ │ ├── domain.types.ts │ │ │ │ └── ui.types.ts │ │ │
├── 📁 utils/ │ │ │ │ ├── validation.ts │ │ │ │ ├── formatting.ts │ │ │ │ ├──
calculations.ts │ │ │ │ └── constants.ts │ │ │ ├── 📁 config/ │ │ │ │ ├──
routes.ts │ │ │ │ ├── permissions.ts │ │ │ │ └── defaults.ts │ │ │ └── 📁
**tests**/ │ │ │ └── ... │ │ ├── 📁 [core-feature-2]/ # Secondary feature │ │ │
└── ... # Same structure as above │ │ ├── 📁 analytics/ │ │ │ ├── 📁 components/
│ │ │ │ ├── 📁 dashboards/ │ │ │ │ │ ├── OverviewDashboard.tsx │ │ │ │ │ ├──
MetricsDashboard.tsx │ │ │ │ │ └── RealtimeDashboard.tsx │ │ │ │ ├── 📁 charts/
│ │ │ │ │ ├── LineChart.tsx │ │ │ │ │ ├── BarChart.tsx │ │ │ │ │ ├──
PieChart.tsx │ │ │ │ │ └── HeatMap.tsx │ │ │ │ ├── 📁 metrics/ │ │ │ │ │ ├──
MetricCard.tsx │ │ │ │ │ ├── MetricTrend.tsx │ │ │ │ │ └── MetricComparison.tsx
│ │ │ │ └── 📁 reports/ │ │ │ │ ├── ReportBuilder.tsx │ │ │ │ ├──
ReportViewer.tsx │ │ │ │ └── ReportExporter.tsx │ │ │ ├── 📁 hooks/ │ │ │ │ ├──
useAnalytics.ts │ │ │ │ ├── useMetrics.ts │ │ │ │ ├── useReports.ts │ │ │ │ └──
useRealtime.ts │ │ │ ├── 📁 services/ │ │ │ │ ├── analyticsService.ts │ │ │ │
├── metricsService.ts │ │ │ │ ├── reportingService.ts │ │ │ │ └──
trackingService.ts │ │ │ ├── 📁 store/ │ │ │ │ └── analyticsStore.ts │ │ │ ├──
📁 types/ │ │ │ │ └── analytics.types.ts │ │ │ └── 📁 utils/ │ │ │ ├──
calculations.ts │ │ │ ├── formatters.ts │ │ │ └── chartHelpers.ts │ │ ├── 📁
billing/ │ │ │ ├── 📁 components/ │ │ │ │ ├── 📁 subscription/ │ │ │ │ │ ├──
SubscriptionPlan.tsx │ │ │ │ │ ├── PlanComparison.tsx │ │ │ │ │ ├──
UpgradeModal.tsx │ │ │ │ │ └── CancelModal.tsx │ │ │ │ ├── 📁 payment/ │ │ │ │ │
├── PaymentMethod.tsx │ │ │ │ │ ├── PaymentForm.tsx │ │ │ │ │ └──
PaymentHistory.tsx │ │ │ │ ├── 📁 invoices/ │ │ │ │ │ ├── InvoiceList.tsx │ │ │
│ │ ├── InvoiceDetail.tsx │ │ │ │ │ └── InvoiceDownload.tsx │ │ │ │ └── 📁
usage/ │ │ │ │ ├── UsageChart.tsx │ │ │ │ ├── UsageAlerts.tsx │ │ │ │ └──
UsageLimits.tsx │ │ │ ├── 📁 hooks/ │ │ │ │ ├── useBilling.ts │ │ │ │ ├──
useSubscription.ts │ │ │ │ ├── usePayment.ts │ │ │ │ └── useUsage.ts │ │ │ ├──
📁 services/ │ │ │ │ ├── stripeService.ts │ │ │ │ ├── meteringService.ts │ │ │ │
├── invoiceService.ts │ │ │ │ └── webhookService.ts │ │ │ ├── 📁 store/ │ │ │ │
└── billingStore.ts │ │ │ ├── 📁 types/ │ │ │ │ └── billing.types.ts │ │ │ └──
📁 utils/ │ │ │ ├── pricingHelpers.ts │ │ │ ├── planCalculations.ts │ │ │ └──
paymentUtils.ts │ │ ├── 📁 integrations/ │ │ │ ├── 📁 components/ │ │ │ │ ├── 📁
connectors/ │ │ │ │ │ ├── IntegrationCard.tsx │ │ │ │ │ ├── ConnectButton.tsx │
│ │ │ │ └── StatusIndicator.tsx │ │ │ │ ├── 📁 webhooks/ │ │ │ │ │ ├──
WebhookManager.tsx │ │ │ │ │ ├── WebhookTester.tsx │ │ │ │ │ └── WebhookLogs.tsx
│ │ │ │ └── 📁 api-keys/ │ │ │ │ ├── ApiKeyManager.tsx │ │ │ │ ├──
ApiKeyGenerator.tsx │ │ │ │ └── ApiKeyUsage.tsx │ │ │ ├── 📁 hooks/ │ │ │ │ ├──
useIntegrations.ts │ │ │ │ ├── useWebhooks.ts │ │ │ │ └── useApiKeys.ts │ │ │
├── 📁 services/ │ │ │ │ ├── integrationService.ts │ │ │ │ ├── webhookService.ts
│ │ │ │ ├── apiKeyService.ts │ │ │ │ └── 📁 providers/ │ │ │ │ ├── zapier.ts │ │
│ │ ├── slack.ts │ │ │ │ ├── discord.ts │ │ │ │ ├── webhook.ts │ │ │ │ └──
oauth.ts │ │ │ ├── 📁 store/ │ │ │ │ └── integrationStore.ts │ │ │ ├── 📁 types/
│ │ │ │ └── integration.types.ts │ │ │ └── 📁 utils/ │ │ │ ├──
integrationHelpers.ts │ │ │ ├── webhookValidation.ts │ │ │ └── oauthHelpers.ts │
│ ├── 📁 notifications/ │ │ │ ├── 📁 components/ │ │ │ │ ├──
NotificationCenter.tsx │ │ │ │ ├── NotificationItem.tsx │ │ │ │ ├──
NotificationSettings.tsx │ │ │ │ └── NotificationPreferences.tsx │ │ │ ├── 📁
hooks/ │ │ │ │ ├── useNotifications.ts │ │ │ │ └── useNotificationSettings.ts │
│ │ ├── 📁 services/ │ │ │ │ ├── notificationService.ts │ │ │ │ ├──
emailService.ts │ │ │ │ ├── pushService.ts │ │ │ │ └── smsService.ts │ │ │ ├──
📁 store/ │ │ │ │ └── notificationStore.ts │ │ │ ├── 📁 types/ │ │ │ │ └──
notification.types.ts │ │ │ └── 📁 utils/ │ │ │ └── notificationHelpers.ts │ │
└── 📁 widget/ # Optional: Embeddable widgets │ │ ├── 📁 components/ │ │ │ ├──
EmbeddableWidget.tsx │ │ │ ├── WidgetIframe.tsx │ │ │ ├── WidgetLoader.tsx │ │ │
└── WidgetConfig.tsx │ │ ├── 📁 hooks/ │ │ │ ├── usePostMessage.ts │ │ │ ├──
useWidgetConfig.ts │ │ │ └── useWidgetAuth.ts │ │ ├── 📁 services/ │ │ │ ├──
widgetService.ts │ │ │ └── embedService.ts │ │ ├── 📁 store/ │ │ │ └──
widgetStore.ts │ │ ├── 📁 types/ │ │ │ └── widget.types.ts │ │ └── 📁 utils/ │ │
├── shadowDomHelpers.ts │ │ ├── postMessageHelpers.ts │ │ └── embedHelpers.ts │
├── 📁 components/ # Atomic Design System (Pure UI) │ │ ├── 📁 atoms/ # Basic
building blocks │ │ │ ├── 📁 Button/ │ │ │ │ ├── Button.tsx │ │ │ │ ├──
Button.stories.tsx │ │ │ │ ├── Button.test.tsx │ │ │ │ ├── Button.module.css #
Optional: component-specific styles │ │ │ │ └── index.ts │ │ │ ├── 📁 Input/ │ │
│ │ ├── Input.tsx │ │ │ │ ├── TextInput.tsx │ │ │ │ ├── NumberInput.tsx │ │ │ │
├── PasswordInput.tsx │ │ │ │ ├── Input.stories.tsx │ │ │ │ ├── Input.test.tsx │
│ │ │ └── index.ts │ │ │ ├── 📁 Typography/ │ │ │ │ ├── Heading.tsx │ │ │ │ ├──
Text.tsx │ │ │ │ ├── Link.tsx │ │ │ │ ├── Code.tsx │ │ │ │ └── index.ts │ │ │
├── 📁 Avatar/ │ │ │ ├── 📁 Badge/ │ │ │ ├── 📁 Icon/ │ │ │ ├── 📁 Spinner/ │ │
│ ├── 📁 Progress/ │ │ │ ├── 📁 Separator/ │ │ │ └── 📁 Image/ │ │ ├── 📁
molecules/ # Component combinations │ │ │ ├── 📁 SearchBar/ │ │ │ │ ├──
SearchBar.tsx │ │ │ │ ├── SearchInput.tsx │ │ │ │ ├── SearchResults.tsx │ │ │ │
└── index.ts │ │ │ ├── 📁 FormField/ │ │ │ │ ├── FormField.tsx │ │ │ │ ├──
FormLabel.tsx │ │ │ │ ├── FormError.tsx │ │ │ │ └── FormHint.tsx │ │ │ ├── 📁
NavigationItem/ │ │ │ ├── 📁 StatCard/ │ │ │ ├── 📁 AlertDialog/ │ │ │ ├── 📁
Dropdown/ │ │ │ ├── 📁 Tooltip/ │ │ │ ├── 📁 Pagination/ │ │ │ └── 📁
DataTableRow/ │ │ ├── 📁 organisms/ # Complex UI sections │ │ │ ├── 📁 Header/ │
│ │ │ ├── Header.tsx │ │ │ │ ├── Navigation.tsx │ │ │ │ ├── UserMenu.tsx │ │ │ │
├── NotificationBell.tsx │ │ │ │ └── index.ts │ │ │ ├── 📁 Sidebar/ │ │ │ │ ├──
Sidebar.tsx │ │ │ │ ├── SidebarNav.tsx │ │ │ │ ├── SidebarFooter.tsx │ │ │ │ └──
index.ts │ │ │ ├── 📁 DataTable/ │ │ │ │ ├── DataTable.tsx │ │ │ │ ├──
DataTableHeader.tsx │ │ │ │ ├── DataTableBody.tsx │ │ │ │ ├──
DataTableFooter.tsx │ │ │ │ ├── DataTableFilters.tsx │ │ │ │ └── index.ts │ │ │
├── 📁 Modal/ │ │ │ │ ├── Modal.tsx │ │ │ │ ├── ModalHeader.tsx │ │ │ │ ├──
ModalBody.tsx │ │ │ │ ├── ModalFooter.tsx │ │ │ │ └── index.ts │ │ │ ├── 📁
CommandPalette/ │ │ │ ├── 📁 FileUploader/ │ │ │ ├── 📁 DateRangePicker/ │ │ │
└── 📁 Footer/ │ │ ├── 📁 templates/ # Page layouts │ │ │ ├── 📁
DashboardLayout/ │ │ │ │ ├── DashboardLayout.tsx │ │ │ │ ├──
DashboardSidebar.tsx │ │ │ │ ├── DashboardHeader.tsx │ │ │ │ └── index.ts │ │ │
├── 📁 AuthLayout/ │ │ │ ├── 📁 LandingLayout/ │ │ │ ├── 📁 SettingsLayout/ │ │
│ ├── 📁 MinimalLayout/ │ │ │ └── 📁 WidgetLayout/ │ │ └── 📁 ui/ # ShadCN
Components (auto-generated) │ │ ├── button.tsx │ │ ├── input.tsx │ │ ├──
card.tsx │ │ ├── dialog.tsx │ │ ├── dropdown-menu.tsx │ │ ├── sheet.tsx │ │ ├──
toast.tsx │ │ ├── table.tsx │ │ ├── form.tsx │ │ ├── select.tsx │ │ ├──
calendar.tsx │ │ ├── popover.tsx │ │ └── ... # Other ShadCN components │ ├── 📁
lib/ # Core utilities & configurations │ │ ├── 📁 auth/ │ │ │ ├── config.ts #
NextAuth configuration │ │ │ ├── providers.ts # Auth providers (Google, GitHub,
etc.) │ │ │ ├── jwt.ts # JWT utilities │ │ │ ├── middleware.ts # Auth middleware
│ │ │ ├── permissions.ts # RBAC permissions │ │ │ └── session.ts # Session
management │ │ ├── 📁 database/ │ │ │ ├── 📁 connections/ │ │ │ │ ├──
primary.ts # Primary database │ │ │ │ ├── readonly.ts # Read replica │ │ │ │ └──
analytics.ts # Analytics database │ │ │ ├── 📁 tenant-strategies/ │ │ │ │ ├──
shared-database.ts # Single DB with tenant_id │ │ │ │ ├──
database-per-tenant.ts # Separate DB per tenant │ │ │ │ └── hybrid.ts # Mixed
approach │ │ │ ├── 📁 models/ │ │ │ │ ├── base.ts # Base model with tenant
isolation │ │ │ │ ├── user.ts │ │ │ │ ├── tenant.ts │ │ │ │ ├── subscription.ts
│ │ │ │ └── audit.ts │ │ │ ├── 📁 migrations/ │ │ │ │ ├── 001_initial.sql │ │ │
│ ├── 002_add_tenants.sql │ │ │ │ ├── 003_add_billing.sql │ │ │ │ └──
004_add_audit.sql │ │ │ ├── 📁 seeders/ │ │ │ │ ├── development.ts │ │ │ │ ├──
staging.ts │ │ │ │ ├── production.ts │ │ │ │ └── test.ts │ │ │ ├── client.ts #
Database client (Prisma/Mongoose) │ │ │ ├── connection.ts # Connection
management │ │ │ └── schema.ts # Database schema │ │ ├── 📁 cache/ │ │ │ ├──
redis.ts # Redis client │ │ │ ├── memory.ts # In-memory cache │ │ │ ├──
strategies.ts # Caching strategies │ │ │ └── invalidation.ts # Cache
invalidation │ │ ├── 📁 queue/ │ │ │ ├── bull.ts # Bull queue (Redis-based) │ │
│ ├── processor.ts # Job processor │ │ │ ├── scheduler.ts # Job scheduler │ │ │
└── jobs.ts # Job definitions │ │ ├── 📁 email/ │ │ │ ├── config.ts # Email
configuration │ │ │ ├── service.ts # Email service (SendGrid, etc.) │ │ │ ├── 📁
templates/ │ │ │ │ ├── welcome.tsx │ │ │ │ ├── invitation.tsx │ │ │ │ ├──
password-reset.tsx │ │ │ │ └── billing-alert.tsx │ │ │ └── sender.ts # Email
sending logic │ │ ├── 📁 storage/ │ │ │ ├── config.ts # Storage configuration │
│ │ ├── s3.ts # AWS S3 integration │ │ │ ├── cloudinary.ts # Cloudinary
integration │ │ │ └── local.ts # Local file storage │ │ ├── 📁 payments/ │ │ │
├── stripe.ts # Stripe integration │ │ │ ├── webhooks.ts # Payment webhooks │ │
│ ├── subscriptions.ts # Subscription management │ │ │ └── usage-metering.ts #
Usage-based billing │ │ ├── 📁 realtime/ │ │ │ ├── websocket.ts # WebSocket
server │ │ │ ├── sse.ts # Server-Sent Events │ │ │ ├── pusher.ts # Pusher
integration │ │ │ └── socket.io.ts # Socket.io integration │ │ ├── 📁
integrations/ │ │ │ ├── 📁 api-clients/ │ │ │ │ ├── zapier.ts │ │ │ │ ├──
slack.ts │ │ │ │ ├── discord.ts │ │ │ │ └── webhook.ts │ │ │ └── 📁
webhook-handlers/ │ │ │ ├── stripe.ts │ │ │ ├── auth0.ts │ │ │ └── custom.ts │ │
├── 📁 monitoring/ │ │ │ ├── logger.ts # Structured logging │ │ │ ├──
metrics.ts # Application metrics │ │ │ ├── tracing.ts # Distributed tracing │ │
│ ├── sentry.ts # Error monitoring │ │ │ └── healthcheck.ts # Health check
endpoints │ │ ├── 📁 utils.ts # Shared utilities │ │ ├── 📁 validations.ts # Zod
schemas │ │ ├── 📁 constants.ts # App constants │ │ ├── 📁 env.ts # Environment
validation │ │ ├── 📁 errors.ts # Error handling │ │ └── 📁 types.ts # Global
types │ ├── 📁 middleware/ # Middleware utilities │ │ ├── 📁 auth.ts #
Authentication middleware │ │ ├── 📁 tenant.ts # Tenant isolation middleware │ │
├── 📁 rateLimit.ts # Rate limiting middleware │ │ ├── 📁 cors.ts # CORS
middleware │ │ ├── 📁 security.ts # Security headers middleware │ │ └── 📁
logging.ts # Request logging middleware │ ├── 📁 jobs/ # Background jobs & queue
processors │ │ ├── 📁 processors/ │ │ │ ├── 📁 email/ │ │ │ │ ├──
sendWelcomeEmail.ts │ │ │ │ ├── sendInvoiceEmail.ts │ │ │ │ └──
sendNotification.ts │ │ │ ├── 📁 billing/ │ │ │ │ ├── processPayment.ts │ │ │ │
├── updateSubscription.ts │ │ │ │ └── generateInvoice.ts │ │ │ ├── 📁 analytics/
│ │ │ │ ├── processEvents.ts │ │ │ │ ├── generateReports.ts │ │ │ │ └──
aggregateMetrics.ts │ │ │ └── 📁 maintenance/ │ │ │ ├── cleanupSessions.ts │ │ │
├── archiveData.ts │ │ │ └── updateCache.ts │ │ ├── 📁 schedulers/ │ │ │ ├──
dailyReports.ts │ │ │ ├── weeklyCleanup.ts │ │ │ ├── monthlyBilling.ts │ │ │ └──
healthChecks.ts │ │ ├── 📁 queue.ts # Queue configuration │ │ └── 📁 worker.ts #
Worker process │ ├── 📁 events/ # Event system (pub/sub) │ │ ├── 📁 handlers/ │
│ │ ├── 📁 user/ │ │ │ │ ├── userCreated.ts │ │ │ │ ├── userUpdated.ts │ │ │ │
└── userDeleted.ts │ │ │ ├── 📁 billing/ │ │ │ │ ├── subscriptionCreated.ts │ │
│ │ ├── paymentSucceeded.ts │ │ │ │ └── paymentFailed.ts │ │ │ └── 📁 analytics/
│ │ │ ├── eventTracked.ts │ │ │ └── pageViewed.ts │ │ ├── 📁 emitters/ │ │ │ ├──
userEvents.ts │ │ │ ├── billingEvents.ts │ │ │ └── analyticsEvents.ts │ │ ├── 📁
eventBus.ts # Event bus implementation │ │ └── 📁 types.ts # Event type
definitions │ ├── 📁 security/ # Security utilities │ │ ├── 📁 encryption/ │ │ │
├── aes.ts # AES encryption │ │ │ ├── hash.ts # Hashing utilities │ │ │ └──
crypto.ts # Cryptographic utilities │ │ ├── 📁 audit/ │ │ │ ├── logger.ts #
Audit logging │ │ │ ├── tracker.ts # Activity tracking │ │ │ └── reports.ts #
Audit reports │ │ ├── 📁 compliance/ │ │ │ ├── gdpr.ts # GDPR compliance │ │ │
├── ccpa.ts # CCPA compliance │ │ │ ├── sox.ts # SOX compliance │ │ │ └──
hipaa.ts # HIPAA compliance │ │ ├── 📁 scanners/ │ │ │ ├── vulnerability.ts #
Vulnerability scanning │ │ │ ├── dependency.ts # Dependency scanning │ │ │ └──
code.ts # Code security scanning │ │ └── 📁 headers.ts # Security headers │ ├──
📁 i18n/ # Internationalization (optional) │ │ ├── 📁 locales/ │ │ │ ├──
en.json # English translations │ │ │ ├── es.json # Spanish translations │ │ │
├── fr.json # French translations │ │ │ ├── de.json # German translations │ │ │
└── pt.json # Portuguese translations │ │ ├── config.ts # i18n configuration │ │
├── utils.ts # Translation utilities │ │ └── middleware.ts # i18n middleware │
├── 📁 content/ # CMS & Static Content (optional) │ │ ├── 📁 blog/ │ │ │ ├──
getting-started.mdx │ │ │ ├── best-practices.mdx │ │ │ └── announcements.mdx │ │
├── 📁 pages/ │ │ │ ├── about.mdx │ │ │ ├── features.mdx │ │ │ └── pricing.mdx │
│ ├── 📁 legal/ │ │ │ ├── privacy-policy.mdx │ │ │ ├── terms-of-service.mdx │ │
│ ├── cookie-policy.mdx │ │ │ └── data-processing.mdx │ │ └── 📁 help/ │ │ ├──
getting-started.mdx │ │ ├── troubleshooting.mdx │ │ └── faq.mdx │ ├── 📁
hooks/ # Shared React hooks │ │ ├── 📁 use-debounce.ts │ │ ├── 📁
use-local-storage.ts │ │ ├── 📁 use-session-storage.ts │ │ ├── 📁
use-media-query.ts │ │ ├── 📁 use-tenant-context.ts │ │ ├── 📁 use-api.ts │ │
├── 📁 use-toast.ts │ │ ├── 📁 use-clipboard.ts │ │ ├── 📁
use-intersection-observer.ts │ │ └── 📁 use-outside-click.ts │ ├── 📁 store/ #
Global Zustand stores │ │ ├── 📁 global-store.ts # Global app state │ │ ├── 📁
theme-store.ts # Theme & UI preferences │ │ ├── 📁 tenant-store.ts # Current
tenant context │ │ ├── 📁 notification-store.ts # Toast notifications │ │ ├── 📁
modal-store.ts # Global modals │ │ └── 📁 command-store.ts # Command palette │
├── 📁 types/ # Global TypeScript definitions │ │ ├── 📁 global.ts # Global
utility types │ │ ├── 📁 api.ts # API response types │ │ ├── 📁 tenant.ts #
Multi-tenant types │ │ ├── 📁 database.ts # Database model types │ │ ├── 📁
auth.ts # Authentication types │ │ ├── 📁 billing.ts # Billing & subscription
types │ │ ├── 📁 next-auth.d.ts # NextAuth type extensions │ │ └── 📁 env.d.ts #
Environment variable types │ └── 📁 constants/ # App-wide constants │ ├── 📁
routes.ts # Application routes │ ├── 📁 api-endpoints.ts # API endpoint
constants │ ├── 📁 permissions.ts # Permission constants │ ├── 📁
feature-flags.ts # Feature flag definitions │ ├── 📁 billing-plans.ts #
Subscription plans │ ├── 📁 integration-providers.ts # Integration provider
configs │ └── 📁 config.ts # General app configuration ├── 📁 public/ # Static
assets │ ├── 📁 images/ │ │ ├── 📁 logos/ │ │ ├── 📁 icons/ │ │ ├── 📁 avatars/
│ │ ├── 📁 illustrations/ │ │ └── 📁 screenshots/ │ ├── 📁 files/ │ │ ├── 📁
templates/ │ │ ├── 📁 samples/ │ │ └── 📁 downloads/ │ ├── 📁 fonts/ # Custom
fonts │ ├── 📁 audio/ # Audio files │ ├── 📁 video/ # Video files │ ├── 📁
widget/ # Widget-specific assets (optional) │ │ ├── 📁 embed.js # CDN-ready
widget script │ │ ├── 📁 styles.css # Widget styles │ │ └── 📁 config.json #
Widget configuration │ ├── favicon.ico │ ├── manifest.json # PWA manifest │ ├──
robots.txt │ └── sitemap.xml ├── 📁 docs/ # Documentation │ ├── 📁 api/ # API
documentation │ │ ├── README.md │ │ ├── authentication.md │ │ ├── endpoints.md │
│ └── webhooks.md │ ├── 📁 deployment/ # Deployment guides │ │ ├── vercel.md │ │
├── aws.md │ │ ├── docker.md │ │ └── kubernetes.md │ ├── 📁 architecture/ #
Architecture decisions │ │ ├── README.md │ │ ├── multi-tenancy.md │ │ ├──
security.md │ │ └── scaling.md │ ├── 📁 user-guides/ # User documentation │ │
├── getting-started.md │ │ ├── admin-guide.md │ │ └── troubleshooting.md │ ├──
📁 development/ # Development setup │ │ ├── README.md │ │ ├── setup.md │ │ ├──
contributing.md │ │ └── testing.md │ └── CHANGELOG.md ├── 📁 tests/ # Test files
│ ├── 📁 **mocks**/ # Test mocks │ │ ├── next-auth.ts │ │ ├── stripe.ts │ │ ├──
prisma.ts │ │ ├── redis.ts │ │ └── pusher.ts │ ├── 📁 unit/ # Unit tests │ │ ├──
📁 components/ │ │ │ ├── 📁 atoms/ │ │ │ ├── 📁 molecules/ │ │ │ └── 📁
organisms/ │ │ ├── 📁 hooks/ │ │ ├── 📁 utils/ │ │ ├── 📁 services/ │ │ └── 📁
modules/ │ ├── 📁 integration/ # Integration tests │ │ ├── 📁 api/ │ │ │ ├──
auth.test.ts │ │ │ ├── billing.test.ts │ │ │ └── tenants.test.ts │ │ ├── 📁
database/ │ │ │ ├── migrations.test.ts │ │ │ ├── models.test.ts │ │ │ └──
queries.test.ts │ │ └── 📁 modules/ │ │ ├── auth.test.ts │ │ ├── billing.test.ts
│ │ └── analytics.test.ts │ ├── 📁 e2e/ # End-to-end tests │ │ ├── 📁 auth/ │ │
│ ├── login.spec.ts │ │ │ ├── register.spec.ts │ │ │ └── password-reset.spec.ts
│ │ ├── 📁 dashboard/ │ │ │ ├── navigation.spec.ts │ │ │ ├──
crud-operations.spec.ts │ │ │ └── permissions.spec.ts │ │ ├── 📁 billing/ │ │ │
├── subscription.spec.ts │ │ │ ├── payment.spec.ts │ │ │ └── invoices.spec.ts │
│ ├── 📁 multi-tenant/ │ │ │ ├── tenant-isolation.spec.ts │ │ │ ├──
tenant-switching.spec.ts │ │ │ └── data-separation.spec.ts │ │ └── 📁 widget/ │
│ ├── embed.spec.ts │ │ └── iframe.spec.ts │ ├── 📁 performance/ # Performance
tests │ │ ├── load-testing.spec.ts │ │ ├── lighthouse.spec.ts │ │ ├──
memory-usage.spec.ts │ │ └── database-performance.spec.ts │ ├── 📁 security/ #
Security tests │ │ ├── auth.spec.ts │ │ ├── tenant-isolation.spec.ts │ │ ├──
xss-csrf.spec.ts │ │ ├── sql-injection.spec.ts │ │ └── rate-limiting.spec.ts │
├── 📁 accessibility/ # Accessibility tests │ │ ├── a11y.spec.ts │ │ ├──
keyboard-navigation.spec.ts │ │ └── screen-reader.spec.ts │ ├── 📁 fixtures/ #
Test data │ │ ├── users.json │ │ ├── tenants.json │ │ ├── subscriptions.json │ │
├── sample-data.json │ │ └── mock-responses.json │ ├── 📁 helpers/ # Test
utilities │ │ ├── setup.ts │ │ ├── cleanup.ts │ │ ├── factories.ts │ │ └──
assertions.ts │ └── 📁 setup/ # Test configuration │ ├── jest.setup.ts │ ├──
playwright.setup.ts │ ├── database.setup.ts │ └── environment.setup.ts ├── 📁
scripts/ # Build & deployment scripts │ ├── 📁 build/ │ │ ├── build.js │ │ ├──
analyze.js │ │ └── optimize.js │ ├── 📁 deployment/ │ │ ├── deploy.js │ │ ├──
migrate.js │ │ └── rollback.js │ ├── 📁 database/ │ │ ├── migrate.js │ │ ├──
seed.js │ │ ├── backup.js │ │ └── restore.js │ ├── 📁 maintenance/ │ │ ├──
cleanup.js │ │ ├── health-check.js │ │ └── performance-monitor.js │ └── 📁
development/ │ ├── setup-dev.js │ ├── generate-types.js │ └── lint-fix.js ├── 📁
infrastructure/ # Infrastructure as Code (optional) │ ├── 📁 docker/ │ │ ├──
Dockerfile │ │ ├── docker-compose.yml │ │ ├── docker-compose.prod.yml │ │ ├──
docker-compose.test.yml │ │ └── .dockerignore │ ├── 📁 kubernetes/ │ │ ├── 📁
manifests/ │ │ │ ├── namespace.yaml │ │ │ ├── deployment.yaml │ │ │ ├──
service.yaml │ │ │ ├── ingress.yaml │ │ │ └── configmap.yaml │ │ └── 📁 helm/ │
│ ├── Chart.yaml │ │ ├── values.yaml │ │ └── 📁 templates/ │ ├── 📁 terraform/ │
│ ├── 📁 aws/ │ │ │ ├── main.tf │ │ │ ├── variables.tf │ │ │ ├── outputs.tf │ │
│ └── terraform.tfvars.example │ │ ├── 📁 gcp/ │ │ │ └── ... │ │ └── 📁 azure/ │
│ └── ... │ └── 📁 ci-cd/ │ ├── 📁 github-actions/ │ │ ├── deploy.yml │ │ ├──
test.yml │ │ ├── security-scan.yml │ │ └── release.yml │ ├── 📁 gitlab-ci/ │ │
└── .gitlab-ci.yml │ └── 📁 jenkins/ │ └── Jenkinsfile ├── 📁 .env.local # Local
environment variables ├── 📁 .env.example # Environment template ├── 📁
.env.test # Test environment ├── 📁 .env.staging # Staging environment ├── 📁
.env.production # Production environment ├── 📁 next.config.mjs # Next.js
configuration ├── 📁 tailwind.config.ts # Tailwind + ShadCN setup ├── 📁
tsconfig.json # TypeScript configuration ├── 📁 package.json # Dependencies and
scripts ├── 📁 pnpm-lock.yaml # Package lock file ├── 📁 .eslintrc.json # ESLint
rules ├── 📁 .prettierrc # Prettier formatting ├── 📁 .prettierignore # Prettier
ignore ├── 📁 jest.config.js # Jest testing setup ├── 📁 playwright.config.ts #
E2E testing setup ├── 📁 commitlint.config.js # Commit message linting ├── 📁
lint-staged.config.js # Staged file linting ├── 📁 .husky/ # Git hooks │ ├──
pre-commit │ ├── commit-msg │ └── pre-push ├── 📁 .vscode/ # VS Code
configuration │ ├── settings.json │ ├── extensions.json │ └── launch.json ├── 📁
.gitignore ├── 📁 .gitattributes ├── 📁 middleware.ts # Global middleware
(tenant routing) ├── 📁 instrumentation.ts # OpenTelemetry instrumentation
(optional) ├── 📁 sentry.config.js # Error monitoring configuration ├── 📁
README.md ├── 📁 CONTRIBUTING.md # Contribution guidelines ├── 📁 LICENSE ├── 📁
CHANGELOG.md └── 📁 SECURITY.md # Security policy

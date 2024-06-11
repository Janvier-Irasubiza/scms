from django.urls import path, re_path
from . import views

urlpatterns = [
    path("opps/", views.OpportunitiesView.as_view(), name='opportunities'),
    path("admin-opps/", views.AdminOpportunitiesView.as_view(), name='opportunities'),
    path("car-opps/", views.carOpps.as_view(), name='car-opps'),
    path("opp/<int:id>", views.OpportunityView.as_view(), name='opportunity'),
    path("slag-opp/<str:slag>", views.SlagOpportunityView.as_view(), name='opportunity'),
    path("testimonials/", views.TestimonialsView.as_view(), name='testimonials'),
    path("car-test/", views.carTestimonials.as_view(), name='car-test'),
    path("slag-testimonial/<str:slag>", views.slagTestimonial.as_view(), name='slag-test'),
    path("admin-testimonials/", views.AdminTestimonialsView.as_view(), name='testimonials'),
    path("testimony/<int:id>", views.TestimonyView.as_view(), name='testimony'),
    path("testimony-review/", views.TestimonialsView.as_view(), name='testimony-review'),
    path("families/", views.FamiliesView.as_view(), name='families'),
    path("family/<int:id>/", views.FamilyView.as_view(), name='family'),
    path('children/', views.ChildrenView.as_view(), name="all_children"),
    path('stat-children/', views.ChildrenByStatusView.as_view(), name="children_by_status"),
    path('sect-children/', views.ChildrenBySectorView.as_view(), name="children_by_sector"),
    path('sector-children/', views.SectorChildren.as_view(), name="children_by_sector"),
    path('sect-stat-children/', views.ChildrenBySectorAndStatusView.as_view(), name="children_by_sector_and_status"),
    path('cell-children/', views.ChildrenByCellView.as_view(), name="children_by_cell"),
    path('cap-cell-children/', views.CellChildren.as_view(), name="children_by_cell"),
    path('children-by-cell/', views.ChildrenByCaptureCell.as_view(), name="children_by_cell"),
    path('cell-stat-children/', views.ChildrenByCellAndStatusView.as_view(), name="children_by_cell_and_status"),
    path('cell-children-by-status/', views.CellChildrenByStatusView.as_view(), name="cell_children_by_status"),
    path('cell-children-by-date-range/', views.CellChildrenByDateRangeView.as_view(), name="cell_children_by_date_range"),
    path('children-by-date/', views.ChildrenByDate.as_view(), name="children_by_date"),
    path('cell-children-by-date/', views.CellChildrenByDate.as_view(), name="cell_children_by_date"),
    path('cell-children-by-status-and-date/', views.CellChildrenByStatusAndDate.as_view(), name="cell_children_by_status_and_date"),
    path('cell-children-by-sdr/', views.CellChildrenByStatusAndDateRange.as_view(), name="cell_children_by_status_and_date_range"),
    path('dr-children/', views.ChildrenByDateRange.as_view(), name="children_by_date_range"),
    path('cdr-children/', views.ChildrenByCdr.as_view(), name="children_by_cell_and_date_range"),
    path('cd-children/', views.ChildrenByCd.as_view(), name="children_by_cell_and_date"),
    path('cs-children/', views.ChildrenByCs.as_view(), name="children_by_cell_and_status"),
    path('csd-children/', views.ChildrenByCsd.as_view(), name="children_by_cell_and_status_and_date"),
    path('csdr-children/', views.ChildrenByCsdr.as_view(), name="children_by_cell_and_status_and_date_range"),
    path('users/', views.UsersView.as_view(), name="users"),
    path('user-uuid/<uuid:user_uuid>/', views.UserByUuid.as_view(), name="user"),
    path('profile/<uuid:user_uuid>/', views.ProfileView.as_view(), name="profile"),
    path('change-password/<uuid:user_uuid>/', views.ChangePassword.as_view(), name="change_password"),
    path('update-password/<uuid:user_uuid>/', views.UpdatePassword.as_view(), name="change_password"),
    path('ns-users/', views.NonSuperUsersView.as_view(), name="ns-users"),
    path('user/<int:id>', views.UserView.as_view(), name="user"),
    path('my-acts/<int:id>', views.UserActivitiesView.as_view(), name="my-acts"),
    path('cases/', views.CasesView.as_view(), name="cases"),
    path('sect-cases/', views.CasesBySector.as_view(), name="cases_by_sector"),
    path('cell-cases/', views.CasesByCell.as_view(), name="cases_by_Cell"),
    path('date-range-cases/', views.CasesByDateRange.as_view(), name="cases_by_dates"),
    path('date-cases/', views.CasesByDate.as_view(), name="cases-by_date"),
    path('cell-date-cases/', views.CellCasesByDate.as_view(), name="cases-by_date"), 
    path('cell-date-range-cases/', views.CellCasesByDateRange.as_view(), name="cases-by_date"), 
    path('sector-date-cases/', views.CasesBySectorAndDatesRange.as_view(), name="cases_by_sector_and_date_range"),
    path('cell-date-cases/', views.CasesByCellAndDatesRange.as_view(), name="cases_by_cell_and_date_range"),
    path('date-cell-cases/', views.CasesByCellAndDate.as_view(), name="cases_by_cell_and_date"),
    path('child/<int:id>', views.ChildView.as_view(), name="child"),
    path('child-case/<int:child>/', views.ChildCase.as_view(), name="child-case"),
    path('case/<int:id>/', views.CaseInfo.as_view(), name="case"),
    path('familychildren/<int:family>/', views.FamChildren.as_view(), name="children-of-family"),
    path('cells/', views.CellsView.as_view(), name="cells"),
    path('sector-cells/', views.SectorCells.as_view(), name="sector_cells"),
    path('sectors/', views.SectorView.as_view(), name="sectors"),
    path('overview/', views.Overview.as_view(), name="overview"),
    path('rehab-overview/', views.RehabOverview.as_view(), name="overview"),
    path('cell-families/', views.FamiliesInCell.as_view(), name="cell_families"),
    path('cell-critical-families/', views.CellCriticalFamilies.as_view(), name="cell_families"),
    path('families-by-cell-and-status/', views.CellAndStatusFamilies.as_view(), name="families-by-cell-and-status"),
    path('families-by-status/', views.FamiliesByStatus.as_view(), name="cell_families"),
    path('cell-families-by-status/', views.CellFamiliesByStatus.as_view(), name="cell_families"),
    path('cell-overview/', views.ChildrenInCellOverview.as_view(), name="cell-overview"),
    path('flush/', views.FlushModel.as_view(), name="flush"),
    path('statistics/', views.Statistics.as_view(), name="stats"),
    path('change-child-pp/<int:id>', views.ChildImageView.as_view(), name="change_child_pp"),
] 

urlpatterns += [
    re_path('login', views.login),
    re_path('logout', views.logout_view),
]
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.views import APIView
from django.db.models import Q, Count
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.utils.timezone import make_aware
from datetime import datetime, timedelta
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Max
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import OpportunitySerializer, PasswordChangeSerializer, ProfileSerializer, TestimonialSerializer, SectorSerializer, CellSerializer, FamilySerializer, ChildrenSerializer, CaseSerializer, UserSerializer, PasswordUpdateSerializer, UserActivitySerializer, SingleFamilySerializer, ChildImageSerializer
from .models import Opportunity, Testimonial, Sector, Cell, Family, Children, Case, User, UserActivity


# Email normalizer
# ----------------
def validate_input(input):
    try:
        validate_email(input)
        return input.lower(), None
    
    except ValidationError:
        return input, None
    

def parse_date(date_str):
    try:
        return make_aware(datetime.strptime(date_str, '%Y-%m-%d'))
    except ValueError:
        return None
    

# Authenticate
# ------------
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    username, error = validate_input(username)
    if error:
        return Response({'detail': error}, status=status.HTTP_400_BAD_REQUEST)
    
    try: 
        user = authenticate(username=username, password=password)

        if user is None:
            try:
                user = User.objects.get(email=username)
                user = authenticate(username=user.username, password=password)
            except User.DoesNotExist:
                pass

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            serializer = UserSerializer(instance=user)
            
                        
            user_info = {
                "id": serializer.data['id'],
                "uuid": serializer.data['user_uuid'],
                "username": serializer.data['username'],
                "email": serializer.data['email'],
                "sector": serializer.data['office_sector'],
                "cell": serializer.data['office_cell'],
                "privilege": serializer.data['privilege'] 
            }
            
            return Response({
                    "success": "Authenticated successfully",
                    "token": token.key, 
                    "user": user_info,
                }, status=status.HTTP_200_OK)
        else:
            return Response({
                    "detail": "Invalid credentials"
                }, status=status.HTTP_401_UNAUTHORIZED)
            
    except (ValueError, TypeError):
        return Response({
            'detail': 'Invalid request data'
        }, status=status.HTTP_400_BAD_REQUEST)
        
        
class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer
    lookup_field = 'user_uuid'
    
    def get_queryset(self, *args, **kwargs):
        user_id = self.kwargs.get('user_uuid')
        
        if user_id: 
            try:
                queryset = User.objects.filter(user_uuid=user_id)
                return queryset
            except ValueError:
                return Response({'detail': 'Invalid user'})
                    
        
# Logout
# ------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except (AttributeError, ObjectDoesNotExist):
        return Response({
            "detail": "User does not have an active session."
        }, status=status.HTTP_400_BAD_REQUEST)
    
    request.session.flush()    
    logout(request)
    
    return Response({
        "success": "Logged out successfully",
        "to": "/auth"
    }, status=status.HTTP_200_OK)



# Get and create opportunities
# ----------------------------
class OpportunitiesView(generics.ListCreateAPIView):
    queryset = Opportunity.objects.filter(priority='general')
    serializer_class = OpportunitySerializer
    
    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)

        
class AdminOpportunitiesView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OpportunitySerializer
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'office_sector'):
            queryset = Opportunity.objects.filter(sector=user.office_sector)
            return queryset
        else:
            return Opportunity.objects.all()
        
        
class OpportunityView(generics.RetrieveUpdateAPIView):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        opp = self.kwargs['id']
        
        try:
            queryset = Opportunity.objects.filter(pk=opp)
            return queryset
        except ValueError:
            return Response({"detail": "not found"})
        
        
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        

class SlagOpportunityView(generics.RetrieveAPIView):
    serializer_class = OpportunitySerializer
    lookup_field = 'slag'
    
    def get_queryset(self):
        opp = self.kwargs['slag']
        try:
            queryset = Opportunity.objects.filter(slag=opp)
            return queryset
        except ValueError:
            return Response({"detail": "not found"})
        

class slagTestimonial(generics.RetrieveAPIView):
    serializer_class = OpportunitySerializer
    lookup_field = 'slag'
    
    def get_queryset(self):
        testimonial = self.kwargs['slag']
        try:
            queryset = Testimonial.objects.filter(slag=testimonial)
            return queryset
        except ValueError:
            return Response({"detail": "not found"})


# Get and create testimonials
# ---------------------------
class TestimonialsView(generics.ListCreateAPIView):
    queryset = Testimonial.objects.filter(priority='general')
    serializer_class = TestimonialSerializer
    
    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)
  
class AdminTestimonialsView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TestimonialSerializer
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'office_sector'):
            return Testimonial.objects.filter(sector=user.office_sector)
        else:
            return Testimonial.objects.all()

class TestimonyView(generics.RetrieveUpdateAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        testimony = self.kwargs['id']
        
        try:
            queryset = Testimonial.objects.filter(pk=testimony)
            return queryset
        except ValueError:
            return Response({"detail": "not found"})

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Get and create users
# --------------------------
class UsersView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserByUuid(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    lookup_field = 'user_uuid'
    
    def get_queryset(self):
        uuid = self.kwargs.get('user_uuid')
        try:
            queryset = User.objects.filter(user_uuid=uuid)
            return queryset
        except ValueError:
            return Response({'detail': 'Invalid user'})
        
        
class ChangePassword(APIView):
    serializer_class = PasswordUpdateSerializer
    lookup_field = 'user_uuid'

    def put(self, request, *args, **kwargs):
        user_uuid = kwargs.get(self.lookup_field)
        user = get_object_or_404(User, user_uuid=user_uuid)
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            new_password = serializer.validated_data.get('password')
            if new_password:
                user.set_password(new_password)
                user.save()
                return Response({'detail': 'Password updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Password not provided'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdatePassword(APIView):
    serializer_class = PasswordChangeSerializer
    lookup_field = 'user_uuid'

    def put(self, request, *args, **kwargs):
        user_uuid = kwargs.get(self.lookup_field)
        user = get_object_or_404(User, user_uuid=user_uuid)
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            old_password = serializer.validated_data.get('old_password')
            new_password = serializer.validated_data.get('new_password')
            
            if not user.check_password(old_password):
                return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)
            
            if new_password:
                try:
                    user.set_password(new_password)
                    user.save()
                    return Response({'detail': 'Password updated successfully'}, status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({'detail': f'Error updating password: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'detail': 'New password not provided'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


# Get User info
# -------------
class UserView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    lookup_field = 'id'

    def get_queryset(self):
        user = self.kwargs['id']
        query_set = User.objects.filter(id=user)
        return query_set

class NonSuperUsersView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_queryset(self):
        try:
            queryset = User.objects.exclude(privilege='superuser').exclude(privilege='rehab')
            return queryset
        except ValueError:
            return User.objects.none()
        
    def perform_create(self, serializer):
        instance = serializer.save()
        user_uuid = instance.user_uuid
        return Response({'user_uuid': user_uuid}, status=status.HTTP_201_CREATED)
    

# Get user's activities
# --------------------
class UsersActivitiesView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = UserActivity.objects.all().order_by('-done_at')
    serializer_class = UserActivitySerializer


# Get user activities
# -------------------
class UserActivitiesView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserActivitySerializer

    def get_queryset(self):
        user = self.kwargs['id']
        query_set = UserActivity.objects.filter(user=user).order_by('-done_at')
        return query_set
    

# Get and create children 
# -----------------------
class ChildrenView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        first_name = self.request.query_params.get('first_name')
        last_name = self.request.query_params.get('last_name')
        
        queryset = Children.objects.all()
        
        if first_name:
            queryset = Children.objects.filter(firstname__icontains=first_name)
            
        if last_name:
            queryset = Children.objects.filter(lastnamee__icontains=last_name)
            
        queryset = queryset.annotate(cases=Count('case'))
        
        return queryset
    


# Get children by status
# ------------------------
class ChildrenByStatusView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer

    def get_queryset(self):
        status = self.request.query_params.get('status')
        query_set = Children.objects.filter(status=status).annotate(cases=Count('case'))
        return query_set
    

# Get children by sector
# ------------------------
class ChildrenBySectorView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer

    def get_queryset(self):
        sectors = self.request.query_params.getlist('sector')

        if not sectors:
            return Children.objects.none()

        query_set = Children.objects.filter(
            family__sector__in=sectors,
        )

        return query_set
    


class SectorChildren(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        
        if not sector:
            return Children.objects.all()
        
        try:
            queryset = Children.objects.filter(
                case__sector_of_capture=sector
            ).annotate(cases=Count('case'))
            
            return queryset
        except:
            return Children.objects.all()
        
    

# Get children by sector and status
# ---------------------------------
class ChildrenBySectorAndStatusView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer

    def get_queryset(self):
        sectors = self.request.query_params.getlist('sector')
        status = self.request.query_params.getlist('status')

        if sectors is None or status is None:
            return Children.objects.none()

        query_set = Children.objects.all()

        if sectors:
            query_set = query_set.filter(
                family__sector__in=sectors,
                )

        if status:
            query_set = query_set.filter(
                status=status
                )
                    
        return query_set
    
    
  
# Get children by cell
# --------------------
class ChildrenByCellView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer

    def get_queryset(self):
        cell = self.request.query_params.getlist('cell')

        if not cell:
            return Children.objects.none()

        query_set = Children.objects.filter(
            family__cell__in=cell,
        )

        return query_set

    
    
# Get children by cell and status
# ------------------------------- 
class ChildrenByCellAndStatusView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer

    def get_queryset(self):
        cells = self.request.query_params.getlist('cell')
        status = self.request.query_params.getlist('status')

        if not cells or not status:
            return Children.objects.none()

        query_set = Children.objects.all()

        if cells:
            query_set = query_set.filter(
                family__cell__in=cells,
                )

        if status:
            query_set = query_set.filter(
                status=status
                )

        return query_set
    

class CellChildrenByStatusView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer

    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        cell = self.request.query_params.get('cell')
        status = self.request.query_params.get('status')
        
        queryset = Children.objects.all()
        
        if sector:
            queryset = queryset.filter(case__sector_of_capture=sector)
        if cell:
            queryset = queryset.filter(case__cell_of_capture=cell)
        if status:
            queryset = queryset.filter(status=status)
        
        queryset = queryset.annotate(cases=Count('case'))
        return queryset

    def list(self, request):
        queryset = self.get_queryset()
        
        if 'status' not in request.query_params:
            return Response({'details': 'Invalid filters'}, status=400)
        
        if not queryset.exists():
            return Response([])
        
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    
class CellChildrenByStatusAndDate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer

    def get_queryset(self):
        cell = self.request.query_params.get('cell')
        status = self.request.query_params.get('status')
        date = self.request.query_params.get('date')
        
        if cell and status and date:
            try:
                formatted_date = make_aware(datetime.strptime(date, '%Y-%m-%d'))
                start_of_day = make_aware(datetime.combine(formatted_date, datetime.min.time()))
                end_of_day = start_of_day + timedelta(days=1)
                queryset = Children.objects.filter(
                    case__cell_of_capture=cell, 
                    status=status,
                    created_at__gte=start_of_day, created_at__lt=end_of_day
                ).annotate(cases=Count('case'))
                return queryset
            except ValueError:
                return Children.objects.none()
        else:
            return Children.objects.none()
        
    def list(self, request):
        queryset = self.get_queryset()
        if not queryset.exists() and ('cell' not in request.query_params or 'status' not in request.query_params or 'date' not in request.query_params):
            return Response({'details': 'Invalid filters'})
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
        
class CellChildrenByStatusAndDateRange(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer

    def get_queryset(self):
        cell = self.request.query_params.get('cell')
        status = self.request.query_params.get('status')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        
        if cell and status and start_date_str and end_date_str:
            try:
                start_date = make_aware(datetime.strptime(start_date_str, '%Y-%m-%d'))
                end_date = make_aware(datetime.strptime(end_date_str, '%Y-%m-%d'))
                
                queryset = Children.objects.filter(
                    case__cell_of_capture=cell, 
                    status=status,
                    created_at__range=(start_date, end_date)
                ).annotate(cases=Count('case'))
                return queryset
            except ValueError:
                return Children.objects.none()
        else:
            return Children.objects.none()
        
    def list(self, request):
        queryset = self.get_queryset()
        if not queryset.exists() and ('cell' not in request.query_params or 'status' not in request.query_params or 'start_date' not in request.query_params or 'end_date' not in request.query_params):
            return Response({'details': 'Invalid filters'})
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
     
class CellChildrenByDateRangeView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer

    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        cell = self.request.query_params.get('cell')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        
        if not start_date_str or not end_date_str:
            Children.objects.none()
            
        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str)
        
        if not start_date or not end_date:
             Children.objects.none()
             
        end_date += timedelta(days=1)
        
        queryset = Children.objects.filter(
                    case__cell_of_capture=cell,
                    created_at__range=(start_date, end_date)
                )
        
        if sector:
            queryset = Children.objects.filter(
                    case__sector_of_capture=sector,
                    created_at__range=(start_date, end_date)
                )
            
        if cell:
            queryset = Children.objects.filter(
                    case__cell_of_capture=cell,
                    created_at__range=(start_date, end_date)
                )
        
        queryset = queryset.annotate(cases=Count('case'))
        
        return queryset
        
    def list(self, request):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response([])
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    

# Get all families
# ----------------
class FamiliesView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Family.objects.all().annotate(children_num=Count('children'))
    serializer_class = FamilySerializer
    

# Get all cells
# -------------
class CellsView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CellSerializer
    
    def get_queryset(self):        
        cell = self.request.query_params.getlist('cell')
        queryset = Cell.objects.all()
        
        if cell:
            queryset = queryset.filter(cellname__in=cell)
        
        return queryset
    

class SectorCells(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CellSerializer
    
    def get_queryset(self):        
        sector = self.request.query_params.get('sector')
        queryset = Cell.objects.all()
        
        if sector:
            queryset = queryset.filter(sector=sector)
        
        return queryset


# Get all sectors
# ---------------
class SectorView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Sector.objects.all()
    serializer_class = SectorSerializer


# Get one family
# --------------
class FamilyView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FamilySerializer
    lookup_field = 'id'
    
    def get_queryset(self):
        family = self.kwargs['id']
        queryset = Family.objects.filter(id=family).annotate(children_num=Count('children'))
        return queryset


# Get all cases
# -------------
class CasesView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    
    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        
        if sector:
            try:
                queryset = Case.objects.filter(sector_of_capture=sector).order_by('-date_of_capture')
                return queryset
            except ValueError:
                return Case.objects.all().order_by('-date_of_capture')
        else:
            return Case.objects.all().order_by('-date_of_capture')
    


# Get cases by Sector
# -------------------
class CasesBySector(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    
    def get_queryset(self):
        sectors = self.request.query_params.getlist('sector')
        
        if not sectors:
            return Case.objects.none()
        
        queryset = Case.objects.filter(
            sector_of_capture__sectorname__in = sectors,
        )
        
        return queryset
    


# Get cases by cell
# -----------------
class CasesByCell(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    
    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        cells = self.request.query_params.getlist('cell')
        
        if not cells:
            return Case.objects.none()
        
        if sector:
            queryset = Case.objects.filter(
                sector_of_capture=sector,
                cell_of_capture__cellname__in = cells,
            )
        
        queryset = Case.objects.filter(
            cell_of_capture__cellname__in = cells,
        )
        
        return queryset
    
    
    
# Get cases between date range
# ----------------------------
class CasesByDateRange(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    
    def get_queryset(self):
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        
        if start_date_str and end_date_str:
            start_date = make_aware(datetime.strptime(start_date_str, '%Y-%m-%d'))
            end_date = make_aware(datetime.strptime(end_date_str, '%Y-%m-%d'))
            
            queryset = Case.objects.filter(date_of_capture__range=(start_date, end_date))
        
        return queryset


# Get cases by sectors and between dates range
# -----------------------------------------
class CasesBySectorAndDatesRange(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    
    def get_queryset(self):
        sectors = self.request.query_params.getlist('sector')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
                            
        if sectors and start_date_str and end_date_str:
            start_date = make_aware(datetime.strptime(start_date_str, '%Y-%m-%d'))
            end_date = make_aware(datetime.strptime(end_date_str, '%Y-%m-%d'))
            queryset = Case.objects.filter(sector_of_capture__sectorname__in=sectors, date_of_capture__range=(start_date, end_date))
        
        return queryset
    

# get cases by cells and dates range
# ----------------------------------
class CasesByCellAndDatesRange(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    
    def get_queryset(self):
        cells = self.request.query_params.getlist('cell')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
            
        if cells and start_date_str and end_date_str:
            try:
                start_date = make_aware(datetime.strptime(start_date_str, '%Y-%m-%d'))
                end_date = make_aware(datetime.strptime(end_date_str, '%Y-%m-%d'))
                queryset = Case.objects.filter(cell_of_capture__cellname__in=cells, date_of_capture__range=(start_date, end_date))
            except ValueError:
                return Case.objects.none()
                
        return queryset
        
    
# get cases by cells and dates range
# ----------------------------------
class CasesByDate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    
    def get_queryset(self):
        date_str = self.request.query_params.get('date')
                    
        if date_str:
            try:
                date = make_aware(datetime.strptime(date_str, '%Y-%m-%d'))
                start_of_day = make_aware(datetime.combine(date, datetime.min.time()))
                end_of_day = start_of_day + timedelta(days=1)
                queryset = Case.objects.filter(date_of_capture__gte=start_of_day, date_of_capture__lt=end_of_day)
            except ValueError:
                return Case.objects.none()
                
        return queryset
    

class CellCasesByDate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer

    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        cell = self.request.query_params.get('cell')
        date_str = self.request.query_params.get('date')

        start_of_day = end_of_day = None
        if date_str:
            date = parse_date(date_str)
            if date:
                start_of_day = datetime.combine(date, datetime.min.time())
                end_of_day = start_of_day + timedelta(days=1)

        if start_of_day and end_of_day:
            queryset = Case.objects.filter(date_of_capture__gte=start_of_day, date_of_capture__lt=end_of_day)
            if sector and cell:
                queryset = queryset.filter(sector_of_capture=sector, cell_of_capture=cell)
            elif cell and not sector:
                queryset = queryset.filter(cell_of_capture=cell)
            return queryset
        else:
            return Case.objects.none()
    
    

class CellCasesByDateRange(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    
    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        cell = self.request.query_params.getlist('cell')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        
        if not start_date_str or not end_date_str:
            return Case.objects.none()
        
        start_date = parse_date(start_date_str)
        end_date = parse_date(end_date_str)
        
        if not start_date or not end_date:
            return Case.objects.none()
        
        end_date += timedelta(days=1) 
        
        queryset = Case.objects.filter(
            date_of_capture__gte=start_date, 
            date_of_capture__lt=end_date
        )

        if sector:
            queryset = queryset.filter(sector_of_capture=sector)
        
        if cell:
            queryset = queryset.filter(cell_of_capture__in=cell)

        return queryset
    
    def list(self, request):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response([])
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    
    
# Get cases by cell and date
# --------------------------
class CasesByCellAndDate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    
    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        cell = self.request.query_params.getlist('cell')
        date_str = self.request.query_params.get('date')

        start_of_day = end_of_day = None
        if date_str:
            date = parse_date(date_str)
            if date:
                start_of_day = datetime.combine(date, datetime.min.time())
                end_of_day = start_of_day + timedelta(days=1)

        queryset = Case.objects.all()
        
        if start_of_day and end_of_day:
            queryset = queryset.filter(date_of_capture__gte=start_of_day, date_of_capture__lt=end_of_day)
        
        if sector:
            queryset = queryset.filter(sector_of_capture=sector)
        
        if cell:
            queryset = queryset.filter(cell_of_capture__in=cell)
        
        return queryset
        


# Get one child
# -------------
class ChildView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    lookup_field = 'id'

    def get_queryset(self):
        child = self.kwargs['id']
        queryset = Children.objects.filter(id=child).annotate(cases=Count('case'))
        return queryset
    

# Get children by cell of capture
# -------------------------------

class ChildrenByCaptureCell(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        sector = self.request.query_params.getlist('sector')
        cell = self.request.query_params.getlist('cell')
        
        queryset = Children.objects.all()
        
        if sector and cell:
            queryset = queryset.filter(
                case__sector_of_capture__in=sector,
                case__cell_of_capture__in=cell
            )
        elif cell:
            queryset = queryset.filter(
                case__cell_of_capture__in=cell
            )
        
        queryset = queryset.annotate(cases=Count('case'))
        
        return queryset
    
class CellChildren(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        cell = self.request.query_params.getlist('cell')
        
        queryset = Children.objects.all()
        
        if cell:
            queryset = queryset.filter(
                case__cell_of_capture__cellname__in=cell
            )
        
        queryset = queryset.annotate(cases=Count('case'))
        
        return queryset
        
           
    
# Get children by date reported
# -----------------------------
class ChildrenByDate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        date = self.request.query_params.get('date')
        
        if date:
            try:
                formatted_date = make_aware(datetime.strptime(date, '%Y-%m-%d'))
                start_of_day = make_aware(datetime.combine(formatted_date, datetime.min.time()))
                end_of_day = start_of_day + timedelta(days=1)
                queryset = Children.objects.filter(
                        created_at__gte=start_of_day, created_at__lt=end_of_day
                    ).annotate(cases=Count('case'))
            except ValueError:
                return Children.objects.none()
                
        return queryset 
    

class CellChildrenByDate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        cell = self.request.query_params.get('cell')
        date_str = self.request.query_params.get('date')

        start_of_day = end_of_day = None
        if date_str:
            date = parse_date(date_str)
            if date:
                start_of_day = datetime.combine(date, datetime.min.time())
                end_of_day = start_of_day + timedelta(days=1)
                
        if start_of_day and end_of_day:
            if sector and cell:
                queryset = Children.objects.filter(
                            case__sector_of_capture=sector,
                            created_at__gte=start_of_day, created_at__lt=end_of_day
                        ).annotate(cases=Count('case'))
                
            elif cell and not sector:
                queryset = Children.objects.filter(
                            case__cell_of_capture=cell,
                            created_at__gte=start_of_day, created_at__lt=end_of_day
                        ).annotate(cases=Count('case'))
            return queryset
        else:
            return Children.objects.none()
        
    
# Get children by date range
# --------------------------
class ChildrenByDateRange(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date and end_date:
            try:
                formatted_start_date = make_aware(datetime.strptime(start_date, '%Y-%m-%d'))
                formatted_end_date = make_aware(datetime.strptime(end_date, '%Y-%m-%d'))
                queryset = Children.objects.filter(
                        created_at__range=(formatted_start_date, formatted_end_date)
                    ).annotate(cases=Count('case'))
            except ValueError:
                return Children.objects.none()
        
        return queryset
        
class ChildrenByCdr(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        cells = self.request.query_params.getlist('cell')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')        
        
        if cells and start_date_str and end_date_str:
            try:
                start_date = make_aware(datetime.strptime(start_date_str, '%Y-%m-%d'))
                end_date = make_aware(datetime.strptime(end_date_str, '%Y-%m-%d'))
                queryset = Children.objects.filter(
                        case__cell_of_capture__in=cells, 
                        created_at__range=(start_date, end_date)
                    ).annotate(cases=Count('case'))
            except ValueError:
                return Children.objects.none()
        
        return queryset 
    
class ChildrenByCd(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        cells = self.request.query_params.getlist('cell')
        date_str = self.request.query_params.get('date')
        
        start_of_day = end_of_day = None
        if date_str:
            date = parse_date(date_str)
            if date:
                start_of_day = datetime.combine(date, datetime.min.time())
                end_of_day = start_of_day + timedelta(days=1)
        
        if start_of_day and end_of_day:
            if sector and cells:
                queryset = Children.objects.filter(
                            case__sector_of_capture=sector,
                            case__cell_of_capture__in=cells,
                            created_at__gte=start_of_day, created_at__lt=end_of_day
                        )
                
            elif cells and not sector:
                queryset = Children.objects.filter(
                            case__cell_of_capture__in=cells,
                            created_at__gte=start_of_day, created_at__lt=end_of_day
                        )
            queryset = queryset.annotate(cases=Count('case'))
            return queryset
        else:
            return Children.objects.none()
    
    
class ChildrenByCs(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        cells = self.request.query_params.getlist('cell')
        status = self.request.query_params.get('status')
        
        if cells and status:
            queryset = Children.objects.filter(case__cell_of_capture__in=cells, status=status)
            if sector:
                queryset = queryset.filter(case__sector_of_capture=sector)
            queryset = queryset.annotate(cases=Count('case'))
            return queryset
        else:
            return Children.objects.none()  
        
        
class ChildrenByCsd(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        cells = self.request.query_params.getlist('cell')
        status = self.request.query_params.get('status')
        date = self.request.query_params.get('date')
        
        if cells and status and date:
            try:
                formatted_date = make_aware(datetime.strptime(date, '%Y-%m-%d'))
                start_of_day = make_aware(datetime.combine(formatted_date, datetime.min.time()))
                end_of_day = start_of_day + timedelta(days=1)
                queryset = Children.objects.filter(
                        status=status, 
                        case__cell_of_capture__in=cells, 
                        created_at__gte=start_of_day, 
                        created_at__lt=end_of_day
                    ).annotate(cases=Count('case'))
                
            except ValueError:
                return Children.objects.none()
            
        return queryset

class ChildrenByCsdr(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        cells = self.request.query_params.getlist('cell')
        status = self.request.query_params.get('status')
        start_date_str = self.request.query_params.get('start_date')
        end_date_str = self.request.query_params.get('end_date')
        
        if not (cells and status and start_date_str and end_date_str):
            return Children.objects.none()
        
        try:
            start_date = make_aware(datetime.strptime(start_date_str, '%Y-%m-%d'))
            end_date = make_aware(datetime.strptime(end_date_str, '%Y-%m-%d'))
        except (ValueError, TypeError):
            return Children.objects.none()

        queryset = Children.objects.filter(
            status=status,
            case__cell_of_capture__in=cells,
            created_at__range=(start_date, end_date)
        ).annotate(cases=Count('case'))
        
        return queryset
            
        

# Get all cases for one child
# ---------------------------
class ChildCase(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    lookup_field = 'child'

    def get_queryset(self):
        child_id = self.kwargs['child']
        queryset = Case.objects.filter(child=child_id).order_by('-date_of_capture')
        return queryset
    
    
# Get family's children
# ---------------------
class FamChildren(generics.ListAPIView):
        permission_classes = [IsAuthenticated]
        serializer_class = ChildrenSerializer
        lookup_field = 'family'

        def get_queryset(self):
            famId = self.kwargs['family']
            queryset = Children.objects.filter(family=famId).order_by('-created_at')
            queryset = queryset.annotate(cases=Count('case'))
            return queryset
    
    
# Get case info
# ------------- 
class CaseInfo(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CaseSerializer
    lookup_field = 'id'

    def get_queryset(self):
        id = self.kwargs['id']
        queryset = Case.objects.filter(id=id)
        return queryset
    
    
# Count children in every category
# --------------------------------
class Overview(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        sector = self.request.query_params.get('sector')
        if sector:
            try:
                return Children.objects.filter(case__sector_of_capture=sector)
            except ValueError:
                return Children.objects.all()
        else:
            return Children.objects.all()
    
    def get_most_recent_month_data(self, queryset, status):
        most_recent_month = queryset.filter(status=status).aggregate(most_recent_month=Max('created_at'))['most_recent_month']
        
        if most_recent_month:
            first_day_of_month = most_recent_month.replace(day=1)
            last_day_of_month = first_day_of_month + timedelta(days=31)
            
            count = queryset.filter(
                status=status,
                created_at__gte=first_day_of_month,
                created_at__lte=last_day_of_month
            ).count()
            date = first_day_of_month.strftime("%B, %Y")
        else:
            count = 0
            date = "No data"
        
        return count, date
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        in_transit_count, in_transit_date = self.get_most_recent_month_data(queryset, 'In transit centre')
        in_rehab_count, in_rehab_date = self.get_most_recent_month_data(queryset, 'In rehabilitation center')
        in_school_count, in_school_date = self.get_most_recent_month_data(queryset, 'In school')
        in_family_count, in_family_date = self.get_most_recent_month_data(queryset, 'Re-integrated in family')

        return Response({
            'in_transit': {'count': in_transit_count, 'date': in_transit_date},
            'in_rehab': {'count': in_rehab_count, 'date': in_rehab_date},
            'in_school': {'count': in_school_count, 'date': in_school_date},
            'in_family': {'count': in_family_count, 'date': in_family_date},
        }, status=status.HTTP_200_OK)
    

class RehabOverview(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        return Children.objects.all()
    
    def get_most_recent_month_data(self, queryset, status):
        most_recent_month = queryset.filter(status=status).aggregate(most_recent_month=Max('created_at'))['most_recent_month']
        
        if most_recent_month:
            first_day_of_month = most_recent_month.replace(day=1)
            last_day_of_month = first_day_of_month + timedelta(days=31)
            
            count = queryset.filter(
                status=status,
                created_at__gte=first_day_of_month,
                created_at__lte=last_day_of_month
            ).count()
        else:
            count = 0        
        return count
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        in_rehab_count = self.get_most_recent_month_data(queryset, 'In rehabilitation center')
        rehabilitated = self.get_most_recent_month_data(queryset, 'Rehabilitated')

        return Response({
            'in_rehab': {'count': in_rehab_count},
            'rehabilitated': {'count': rehabilitated},
        }, status=status.HTTP_200_OK)
    

class Statistics(generics.ListAPIView):
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        return Children.objects.all()
    
    def get_most_recent_month_data(self, queryset, status):
        most_recent_month = queryset.filter(status=status).aggregate(most_recent_month=Max('created_at'))['most_recent_month']
        
        if most_recent_month:
            first_day_of_month = most_recent_month.replace(day=1)
            last_day_of_month = first_day_of_month + timedelta(days=31)
            
            count = queryset.filter(
                status=status,
                created_at__gte=first_day_of_month,
                created_at__lte=last_day_of_month
            ).count()
            date = first_day_of_month.strftime("%B, %Y")
        else:
            count = 0
            date = "No data"
        
        return count, date
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        in_transit_count, in_transit_date = self.get_most_recent_month_data(queryset, 'In transit centre')
        in_rehab_count, in_rehab_date = self.get_most_recent_month_data(queryset, 'In rehabilitation center')
        in_school_count, in_school_date = self.get_most_recent_month_data(queryset, 'In school')
        in_family_count, in_family_date = self.get_most_recent_month_data(queryset, 'Re-integrated in family')

        return Response({
            'in_transit': {'count': in_transit_count, 'date': in_transit_date},
            'in_rehab': {'count': in_rehab_count, 'date': in_rehab_date},
            'in_school': {'count': in_school_count, 'date': in_school_date},
            'in_family': {'count': in_family_count, 'date': in_family_date},
        }, status=status.HTTP_200_OK)


class FamiliesInCell(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FamilySerializer

    def get_queryset(self):
        cell = self.request.query_params.getlist('cell')
        
        try:
            queryset = Family.objects.filter(cell__in=cell).annotate(children_num=Count('children'))
            return queryset
        except ValueError:
            return Family.objects.none()


class FamiliesByStatus(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FamilySerializer
    
    def get_queryset(self):
        status = self.request.query_params.get('status')
        
        if status:
            queryset = Family.objects.filter(status=status).annotate(children_num=Count('children')).distinct()
            return queryset
        else:
            return Family.objects.none()
        
class CellFamiliesByStatus(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FamilySerializer
    
    def get_queryset(self):
        cell = self.request.query_params.get('cell')
        status = self.request.query_params.get('status')
        
        if status:
            queryset = Family.objects.filter(
                cell=cell, 
                status=status
            ).annotate(children_num=Count('children')).distinct()
            return queryset
        else:
            return Family.objects.none()
        

class CellAndStatusFamilies(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FamilySerializer
    
    def get_queryset(self):
        cells = self.request.query_params.getlist('cell')
        status = self.request.query_params.get('status')
        
        try:
            queryset = Family.objects.filter(cell__in=cells, status=status).annotate(children_num=Count('children'))
            return queryset
        except ValueError:
            return Family.objects.none()


class CellCriticalFamilies(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FamilySerializer
    
    def get_queryset(self):
        cells = self.request.query_params.getlist('cell')
        
        if cells:
            queryset = Family.objects.filter(Q(status='Critical') | Q(status='Dangerous'), cell__in=cells).annotate(children_num=Count('children')).distinct()
            return queryset
        else:
            return Family.objects.none()


class ChildrenInCellOverview(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChildrenSerializer
    
    def get_queryset(self):
        return Children.objects.all()
    
    def get_most_recent_month_data(self, queryset, status):
        cell = self.request.query_params.get('cell')
        
        cellId = Cell.objects.get(cellname=cell)
        
        most_recent_month = queryset.filter(
                status=status, 
                case__cell_of_capture=cellId.id
            ).aggregate(most_recent_month=Max('created_at'))['most_recent_month']
        
        if most_recent_month:
            first_day_of_month = most_recent_month.replace(day=1)
            last_day_of_month = first_day_of_month + timedelta(days=31)
            
            count = queryset.filter(
                status=status,
                created_at__gte=first_day_of_month,
                created_at__lte=last_day_of_month
            ).count()
            date = first_day_of_month.strftime("%B, %Y")
        else:
            count = 0
            date = "No data"
        
        return count, date
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        in_transit_count, in_transit_date = self.get_most_recent_month_data(queryset, 'In transit centre')
        in_rehab_count, in_rehab_date = self.get_most_recent_month_data(queryset, 'In rehabilitation center')
        in_school_count, in_school_date = self.get_most_recent_month_data(queryset, 'In school')
        in_family_count, in_family_date = self.get_most_recent_month_data(queryset, 'Re-integrated in family')

        return Response({
            'in_transit': {'count': in_transit_count, 'date': in_transit_date},
            'in_rehab': {'count': in_rehab_count, 'date': in_rehab_date},
            'in_school': {'count': in_school_count, 'date': in_school_date},
            'in_family': {'count': in_family_count, 'date': in_family_date},
        }, status=status.HTTP_200_OK)


class FlushModel(APIView):
    def delete(self, request, *args, **kwargs):
        try:
            Testimonial.objects.all().delete()
            return Response({"detail": "done"})
        except Exception as e:
            return Response({"detail": str(e)})
        
        
class carOpps(generics.ListCreateAPIView): 
    serializer_class = OpportunitySerializer
    
    def get_queryset(self):
        queryset = Opportunity.objects.filter(priority='high')
        return queryset    

class carTestimonials(generics.ListCreateAPIView): 
    serializer_class = TestimonialSerializer
    
    def get_queryset(self):
        queryset = Testimonial.objects.filter(priority='high')
        return queryset     


class ChildImageView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def put(self, request, *args, **kwargs):
        child_id = self.kwargs['id']
        try:
            child = Children.objects.get(id=child_id)
        except Children.DoesNotExist:
            return Response({"error": "Child not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ChildImageSerializer(data=request.data)

        if serializer.is_valid():
            child.profile_picture = serializer.validated_data['profile_picture']
            child.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
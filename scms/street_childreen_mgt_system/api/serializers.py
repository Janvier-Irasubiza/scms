from rest_framework import serializers
from .models import Sector, Cell, User, UserActivity, Children, Family, Case, Opportunity, Testimonial

class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = ('id', 'sectorname')

class CellSerializer(serializers.ModelSerializer):
    sector = serializers.PrimaryKeyRelatedField(queryset=Sector.objects.all())
    
    class Meta:
        model = Cell
        fields = ('id', 'cellname', 'sector')
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['sector'] = instance.sector.sectorname
        
        return representation
        
    

class UserSerializer(serializers.ModelSerializer):

    office_sector = serializers.PrimaryKeyRelatedField(queryset=Sector.objects.all())
    office_cell = serializers.PrimaryKeyRelatedField(queryset=Cell.objects.all())

    class Meta: 
        model = User
        fields = "__all__"
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation['office_sector']:
            office_sector = Sector.objects.get(pk=representation['office_sector'])
            representation['office_sector'] = {
            "id": office_sector.pk,
            "sector": office_sector.sectorname
        }
        
        if representation['office_cell']:
            office_cell = Cell.objects.get(pk=representation['office_cell'])
        
            representation['office_cell'] = {
                'id': office_cell.pk,
                'cell': office_cell.cellname
            }
        
        return representation
    
class PasswordUpdateSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, required=True)
    

class ChildImageSerializer(serializers.Serializer):
    profile_picture = serializers.FileField(write_only=True, required=True)


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    
    

class UserActivitySerializer(serializers.ModelSerializer):    
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = UserActivity
        fields = "__all__"
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user = User.objects.get(pk=representation['user'])
        representation['user'] = {
            'id': user.pk,
            'names': user.first_name + ' ' + user.last_name,
            # 'cell': user.office_cell,
        }
        
        return representation


class FamilySerializer(serializers.ModelSerializer):
    children = serializers.IntegerField(read_only=True)
    
    class Meta: 
        model = Family
        fields = "__all__"
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['children'] = instance.children_num
        return representation
   
class ChildrenSerializer(serializers.ModelSerializer):
    family = serializers.PrimaryKeyRelatedField(queryset=Family.objects.all())
    cases = serializers.IntegerField(read_only=True)

    class Meta:
        model = Children
        fields = "__all__"
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        family = Family.objects.get(pk=representation['family'])
        representation['family'] = {
            'id': family.id,
            "fathernames": family.fathernames,
            "mothernames": family.mothernames,
            "mariage_status": family.mariage_status,
            "district": family.district,
            "sector": family.sector,
            "cell": family.cell,
            "village": family.village
        }
        
        representation['cases'] = instance.cases
        return representation

    

class CaseSerializer(serializers.ModelSerializer):
    child = serializers.PrimaryKeyRelatedField(queryset=Children.objects.all())

    class Meta: 
        model = Case
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        child = Children.objects.get(pk=representation['child'])
        representation['child'] = {
            'id': child.id,
            'first_name': child.firstname,
            'last_name': child.lastname,
            'age': child.age
        }
        return representation


class OpportunitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Opportunity
        fields = "__all__"

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Testimonial
        fields = "__all__"

class SingleFamilySerializer(serializers.ModelSerializer):
    
    class Meta: 
        model = Family
        exclude = ('created_at', 'update_at', )
        

class ProfileSerializer(serializers.ModelSerializer):

    class Meta: 
        model = User
        fields = [
            'id',
            'user_uuid',
            'first_name',
            'last_name',
            'email',
            'username',
            'phone',
            'gender',
            'age'
            ]
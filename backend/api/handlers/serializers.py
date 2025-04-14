from rest_framework import serializers
from reviews.models import (
    Message,
    Review,
    Reviewer,
    Metadatablock,
    Field,
    Compound,
    File,
)


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for Message model.

    Serializes all fields of the Message model with ordering by timestamp and message.
    """

    class Meta:
        model = Message
        fields = "__all__"
        ordering = ["timestamp", "message"]


class FieldSerializer(serializers.ModelSerializer):
    """
    Serializer for Field model.

    Includes nested serialization of associated chat messages.
    Serializes all fields with ordering by name and description.
    """

    chat = MessageSerializer(many=True)

    class Meta:
        model = Field
        fields = "__all__"
        ordering = ["name", "description"]


class CompoundSerializer(serializers.ModelSerializer):
    """
    Serializer for Compound model.

    Includes nested serialization of primitive fields and chat messages.
    Serializes all fields with ordering by name, description, and primitives.
    """

    primitives = FieldSerializer(read_only=True, many=True)
    chat = MessageSerializer(many=True)

    class Meta:
        model = Compound
        fields = "__all__"
        ordering = ["name", "description", "primitives"]


class MetadatablockSerializer(serializers.ModelSerializer):
    """
    Serializer for Metadatablock model.

    Includes nested serialization of primitive and compound fields.
    Serializes all fields with ordering by name, description, primitives, and compounds.
    """

    primitives = FieldSerializer(read_only=True, many=True)
    compounds = CompoundSerializer(read_only=True, many=True)

    class Meta:
        model = Metadatablock
        fields = "__all__"
        ordering = ["name", "description", "primitives", "compounds"]


class FileSerializer(serializers.ModelSerializer):
    """
    Serializer for File model.

    Serializes all fields with ordering by name and description.
    """

    class Meta:
        model = File
        fields = "__all__"
        ordering = ["name", "description"]


class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for Review model.

    Includes nested serialization of metadatablocks and files.
    Serializes all fields with ordering by reviewer, doi, site_url, revision, accepted, and date.
    """

    metadatablocks = MetadatablockSerializer(read_only=True, many=True)
    files = FileSerializer(read_only=True, many=True)

    class Meta:
        model = Review
        fields = "__all__"
        ordering = ["reviewer", "doi", "site_url", "revision", "accepted", "date"]


class ReviewerSerializer(serializers.ModelSerializer):
    """
    Serializer for Reviewer model.

    Serializes all fields with ordering by first name, last name, and email.
    """

    class Meta:
        model = Reviewer
        fields = "__all__"
        ordering = ["first_name", "last_nameemail"]


class CompoundSerilizer(serializers.Serializer):
    """
    Custom serializer for compound fields.

    Serializes the name and a list of child fields.
    """

    name = serializers.CharField()
    childFields = serializers.ListField(child=serializers.CharField())


class OpenFieldSerializer(serializers.Serializer):
    """
    Custom serializer for open fields.

    Serializes the name, a list of primitive fields, and a list of compound fields.
    """

    name = serializers.CharField()
    primitives = serializers.ListField(child=serializers.CharField())
    compounds = serializers.ListField(child=CompoundSerializer())

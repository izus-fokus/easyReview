import uuid
from django.db import models
from django.utils import timezone


class Reviewer(models.Model):
    """
    Represents a reviewer in the review system.

    Attributes:
        id (UUID): Unique identifier for the reviewer.
        username (str): Username of the reviewer.
        first_name (str): First name of the reviewer.
        last_name (str): Last name of the reviewer.
        email (str): Email address of the reviewer.
        affiliation (str, optional): Affiliation of the reviewer.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    username = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    affiliation = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.first_name}-{self.last_name}"


class Review(models.Model):
    """
    Represents a review in the system.

    Attributes:
        id (UUID): Unique identifier for the review.
        reviewer (Reviewer, optional): Reviewer associated with this review.
        doi (str, optional): Digital Object Identifier for the reviewed item.
        site_url (str, optional): URL of the reviewed site.
        revision (int): Revision number of the review.
        accepted (bool): Whether the review has been accepted.
        date (datetime): Date and time of the review.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    reviewer = models.ForeignKey(
        Reviewer,
        on_delete=models.DO_NOTHING,
        related_name="reviews",
        blank=True,
        null=True,
    )

    doi = models.CharField(max_length=100, blank=True)
    site_url = models.URLField(null=True, blank=True)
    revision = models.PositiveSmallIntegerField()
    accepted = models.BooleanField(default=False)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return self.doi


class Metadatablock(models.Model):
    """
    Represents a metadata block associated with a review.

    Attributes:
        id (UUID): Unique identifier for the metadata block.
        review (Review): Review to which this metadata block belongs.
        name (str): Name of the metadata block.
        description (str, optional): Description of the metadata block.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name="metadatablocks",
    )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self) -> str:
        return f"{self.review} - Block: {self.name}"


class Field(models.Model):
    """
    Represents a field in a metadata block or compound.

    Attributes:
        id (UUID): Unique identifier for the field.
        metadatablock (Metadatablock, optional): Metadata block this field belongs to.
        compound (Compound, optional): Compound this field belongs to.
        name (str): Name of the field.
        description (str, optional): Description of the field.
        accepted (bool, optional): Whether the field has been accepted.
        value (str): Value of the field.
        history (dict): JSON field to store field history.
        field_type (str): Type of the field (default is 'primitive').
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    metadatablock = models.ForeignKey(
        Metadatablock,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="primitives",
    )

    compound = models.ForeignKey(
        "Compound",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="primitives",
    )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    accepted = models.BooleanField(default=None, null=True)
    value = models.TextField()
    history = models.JSONField(default=dict, blank=True)
    field_type = models.CharField(default="primitive", max_length=100, editable=False)

    def __str__(self) -> str:
        if self.metadatablock:
            return f"{self.metadatablock} - Primitive: {self.name}"
        else:
            return f"{self.compound}- Primitive: {self.name}"


class Compound(models.Model):
    """
    Represents a compound field in a metadata block.

    Attributes:
        id (UUID): Unique identifier for the compound.
        metadatablock (Metadatablock): Metadata block this compound belongs to.
        name (str): Name of the compound.
        description (str, optional): Description of the compound.
        accepted (bool): Whether the compound has been accepted.
        field_type (str): Type of the field (default is 'compound').
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    metadatablock = models.ForeignKey(
        Metadatablock,
        on_delete=models.CASCADE,
        related_name="compounds",
    )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    accepted = models.BooleanField(default=False)
    field_type = models.CharField(default="compound", max_length=100, editable=False)

    def __str__(self) -> str:
        return f"{self.metadatablock} - Compound: {self.name}"


class File(models.Model):
    """
    Represents a file associated with a review.

    Attributes:
        id (UUID): Unique identifier for the file.
        review (Review): Review to which this file belongs.
        name (str): Name of the file.
        description (str, optional): Description of the file.
        accepted (bool): Whether the file has been accepted.
        field_type (str): Type of the field (default is 'file').
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    review = models.ForeignKey(
        Review,
        on_delete=models.CASCADE,
        related_name="files",
    )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    accepted = models.BooleanField(default=False)
    field_type = models.CharField(default="file", max_length=100, editable=False)


class Message(models.Model):
    """
    Represents a message associated with a field or compound.

    Attributes:
        id (UUID): Unique identifier for the message.
        field (Field, optional): Field this message is associated with.
        compound (Compound, optional): Compound this message is associated with.
        message (str): Content of the message.
        user (str, optional): User who sent the message.
        timestamp (datetime): Time the message was sent.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    field = models.ForeignKey(
        Field,
        on_delete=models.CASCADE,
        related_name="chat",
        null=True,
        blank=True,
    )

    compound = models.ForeignKey(
        Compound,
        on_delete=models.CASCADE,
        related_name="chat",
        null=True,
        blank=True,
    )

    message = models.TextField()
    user = models.CharField(max_length=100, null=True)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self) -> str:
        return f"{self.field} - {self.timestamp} - {str(self.user)}"

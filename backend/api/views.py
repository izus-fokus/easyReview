from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.decorators import api_view
from rest_framework.generics import (
    ListAPIView,
    ListCreateAPIView,
    CreateAPIView,
    RetrieveUpdateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from reviews.models import Field, File, Message, Review, Reviewer

from . import handlers
from .handlers.fetch import DATASET_FETCH_PARAMS
from .handlers.serializers import (
    FieldSerializer,
    FileSerializer,
    MessageSerializer,
    OpenFieldSerializer,
    ReviewerSerializer,
    ReviewSerializer,
)


# ! Fetching views
@extend_schema(
    operation_id="fetchDatasetFromDOI",
    parameters=DATASET_FETCH_PARAMS,
    responses={200: ReviewSerializer},
    description="""Fetches a dataset from a Dataverse installation and adds it to the database. 
    This function will also check whether the given dataset is already present in the database 
    and thus returns the entry. If not, a new one will be created and returned from this endpoint.
    """,
)
@api_view(["POST"])
def fetchDatasetFromDOI(request):
    """
    Fetch a dataset from a Dataverse installation by its DOI.

    This view handles the process of retrieving a dataset from a Dataverse repository
    and either returning an existing review or creating a new one in the database.

    Args:
        request: The HTTP request object containing dataset fetch parameters.

    Returns:
        Response: A DRF response with the fetched or created review.
    """
    return handlers.fetch.fetch_dataset(request)


# ! Review views
@extend_schema_view(
    get=extend_schema(
        operation_id="getReviewByID",
        description="Returns a review for a given review ID.",
    ),
    put=extend_schema(
        operation_id="updateReview",
        description="Updates a review for a given review ID.",
    ),
    patch=extend_schema(
        operation_id="partialUpdateReview",
        description="Partially updates a review for a given review ID.",
    ),
    delete=extend_schema(
        operation_id="deleteReview",
        description="Deletes a review from the database.",
    ),
)
class ReviewDetails(RetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting individual reviews.

    Provides detailed view and modification capabilities for a specific review,
    including nested related fields like metadatablocks, files, and reviewers.
    """

    serializer_class = ReviewSerializer
    related_fields = [
        "metadatablocks",
        "metadatablocks__primitives",
        "metadatablocks__compounds",
        "metadatablocks__compounds__primitives",
        "files",
        "reviewer",
    ]
    queryset = Review.objects.prefetch_related(*related_fields).all()


@extend_schema_view(
    get=extend_schema(
        operation_id="getReviews",
        description="Returns all reviews",
    ),
)
class ReviewListCreate(ListAPIView):
    """
    API view for listing all reviews.

    Provides a read-only endpoint to retrieve all reviews in the database.
    """

    serializer_class = ReviewSerializer
    queryset = Review.objects.all()


@extend_schema(
    operation_id="getReviewsByDatasetDOI",
    responses={200: ReviewSerializer},
    description="Returns all reviews for a given dataset DOI.",
)
@api_view(["GET"])
def getReviewsByDatasetDOI(request, doi):
    """
    Retrieve reviews associated with a specific dataset DOI.

    Args:
        request: The HTTP request object.
        doi (str): The Digital Object Identifier of the dataset.

    Returns:
        Response: A DRF response containing reviews for the specified dataset.
    """
    return handlers.review.review_by_doi(request, doi)


@extend_schema(
    operation_id="getOpenFieldsByReviewId",
    description="Returns all open fields for a given review ID.",
    responses={200: OpenFieldSerializer(many=True)},
)
@api_view(["GET"])
def getOpenFieldsByReviewId(request, id):
    """
    Retrieve open metadatablock fields for a specific review.

    Args:
        request: The HTTP request object.
        id (str): The primary key of the review to fetch open fields for.

    Returns:
        Response: A DRF response containing open metadatablock fields.
    """
    return handlers.openfields.fetch_open_metadatablock_fields_for_review(id)


@extend_schema(
    operation_id="getReviewsByReviewer",
    responses={200: ReviewSerializer(many=True)},
    description="Returns all reviews for a given reviewer ID.",
)
@api_view(["GET"])
def getReviewByReviewer(request, reviewerid):
    """
    Retrieve reviews associated with a specific reviewer.

    Args:
        request: The HTTP request object.
        reviewerid (str): The ID of the reviewer to filter reviews by.

    Returns:
        Response: A DRF response containing reviews by the specified reviewer.
    """
    return handlers.review.review_by_reviewer(request, reviewerid)


@extend_schema(
    operation_id="getFieldCount",
    description="Returns the number of fields for a given review ID.",
)
@api_view(["GET"])
def getFieldCount(request, id):
    """
    Calculate the total and accepted field count for a specific review.

    Args:
        request: The HTTP request object.
        id (str): The primary key of the review to analyze.

    Returns:
        Response: A DRF response containing field count statistics.
    """
    return handlers.review.get_field_count(request, id)


# ! Field views
@extend_schema_view(
    get=extend_schema(
        operation_id="getFieldByID",
        description="Returns a field for a given field ID.",
    ),
    put=extend_schema(
        operation_id="updateField",
        description="Updates a field for a given field ID.",
    ),
    patch=extend_schema(
        operation_id="partialUpdateField",
        description="Updates a field for a given field ID.",
    ),
)
class FieldDetails(RetrieveUpdateAPIView):
    """
    API view for retrieving and updating individual fields.

    Provides detailed view and modification capabilities for a specific field.
    """

    serializer_class = FieldSerializer
    queryset = Field.objects.all()


# ! Reviewers views
@extend_schema_view(
    get=extend_schema(
        operation_id="getReviewerById",
        description="Returns a reviewer for a given reviewer ID.",
    ),
    put=extend_schema(
        operation_id="updateReviewer",
        description="Updates a reviewer for a given reviewer ID.",
    ),
    patch=extend_schema(
        operation_id="partialUpdateReviewer",
        description="Partially updates a reviewer for a given reviewer ID.",
    ),
    delete=extend_schema(
        operation_id="deleteReviewer",
        description="Deletes a reviewer from the database.",
    ),
)
class ReviewerDetails(RetrieveUpdateDestroyAPIView):
    """
    API view for retrieving, updating, and deleting individual reviewers.

    Provides detailed view and modification capabilities for a specific reviewer.
    """

    serializer_class = ReviewerSerializer
    queryset = Reviewer.objects.all()


@extend_schema_view(
    get=extend_schema(
        operation_id="getReviewers",
        description="Returns all reviewers",
    ),
    post=extend_schema(
        operation_id="addReviewer",
        description="Adds a new reviewer to the database.",
    ),
)
class ReviewerListCreate(ListCreateAPIView):
    """
    API view for listing and creating reviewers.

    Provides endpoints to retrieve all reviewers and add new reviewers to the database.
    """

    serializer_class = ReviewerSerializer
    queryset = Reviewer.objects.all()


# ! File views
@extend_schema_view(
    get=extend_schema(
        operation_id="getFileById",
        description="Returns a file for a given file ID.",
    ),
    put=extend_schema(
        operation_id="updateFile",
        description="Updates a file for a given file ID.",
    ),
    patch=extend_schema(
        operation_id="partialUpdateFile",
        description="Updates a file for a given file ID.",
    ),
    delete=extend_schema(
        operation_id="deleteReviewer",
        description="Deletes a reviewer from the database.",
    ),
)
class FileDetails(RetrieveUpdateAPIView):
    """
    API view for retrieving and updating individual files.

    Provides detailed view and modification capabilities for a specific file.
    """

    serializer_class = FileSerializer
    queryset = File.objects.all()


@extend_schema(
    operation_id="getFilesByReviewId",
    responses={200: FileSerializer(many=True)},
    description="Returns all files for a given review ID.",
)
@api_view(["GET"])
def getFilesByReviewId(request, id):
    """
    Retrieve files associated with a specific review.

    Args:
        request: The HTTP request object.
        id (str): The primary key of the review to fetch files for.

    Returns:
        Response: A DRF response containing files for the specified review.
    """
    return handlers.files.files_by_review_id(request, id)


# ! Chat views
@extend_schema_view(
    get=extend_schema(
        operation_id="getMessageByID",
        description="Returns a Message for a given Message ID.",
    ),
    put=extend_schema(
        operation_id="updateMessage",
        description="Updates a Message for a given Message ID.",
    ),
    patch=extend_schema(
        operation_id="partialUpdateMessage",
        description="Updates a Message for a given Message ID.",
    ),
)
class MessageDetails(RetrieveUpdateAPIView):
    """
    API view for retrieving and updating individual messages.

    Provides detailed view and modification capabilities for a specific message.
    """

    serializer_class = MessageSerializer
    queryset = Message.objects.all()


@extend_schema_view(
    get=extend_schema(
        operation_id="getMessages",
        description="Returns all Messages",
    ),
    post=extend_schema(
        operation_id="addMessage",
        description="Adds a new Message to the database.",
    ),
)
class MessageCreate(CreateAPIView):
    """
    API view for creating and listing messages.

    Provides endpoints to retrieve all messages and add new messages to the database.
    """

    serializer_class = MessageSerializer
    queryset = Message.objects.all()

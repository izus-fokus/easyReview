import datetime
from .serializers import ReviewSerializer

from drf_spectacular.utils import OpenApiParameter
from easyDataverse import Dataverse, Dataset
from easyDataverse.base import DataverseBase
from rest_framework import status
from rest_framework.response import Response

from reviews.models import Review, Metadatablock, Compound, Field

DATASET_FETCH_PARAMS = [
    OpenApiParameter(
        name="site_url",
        description="URL to the dataset",
        required=True,
        type=str,
    ),
    OpenApiParameter(
        name="doi",
        description="DOI of the dataset",
        required=True,
        type=str,
    ),
    OpenApiParameter(
        name="api_token",
        description="API Token to access hidden datasets.",
        type=str,
    ),
]


def fetch_dataset(request):
    """Fetches a dataset from a Dataverse installation and adds it to the database.

    This function will also check whether the given dataset is already present
    in the database and thus returns the entry. If not, a new one will be created
    and returned from this endpoint.

    Args:
        request: The HTTP request containing query parameters for dataset retrieval.

    Returns:
        Response: A DRF response containing the serialized dataset review or an error message.
    """

    # Extract relevant information from the request
    site_url = request.query_params.get("site_url")
    doi = request.query_params.get("doi")
    api_token = request.query_params.get("api_token")

    dataverse = Dataverse(site_url, api_token)

    if site_url is None or doi is None:
        # Check whether the request contains the necessary information
        return Response(
            {"message": "Missing either 'site_url' or 'doi' to fetch the dataset."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # First, check if this dataset is already present in the database
    if Review.objects.filter(doi=doi).exists() is True:
        serializer = ReviewSerializer(Review.objects.get(doi=doi))
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    # Use EasyReview to retrieve the dataset
    dataset = dataverse.load_dataset(pid=doi, download_files=False)

    # Create review object
    review = _create_and_save(
        model=Review,
        doi=doi,
        site_url=site_url,
        revision=1,
        date=datetime.datetime.now(),
    )

    for block_name, block in dataset.metadatablocks.items():
        if _is_empty(block):
            continue

        metadatablock = _create_and_save(
            model=Metadatablock,
            review=review,
            name=block_name,
        )

        _process_metadatablock(block, metadatablock)

    serializer = ReviewSerializer(review)
    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


def _create_and_save(model, **kwargs):
    """Creates a model object and saves it to the database

    Args:
        model: The Django model class to instantiate
        **kwargs: Keyword arguments to pass to the model constructor

    Returns:
        The saved model instance
    """

    obj = model(**kwargs)
    obj.save()

    return obj


def _process_metadatablock(block, foreign_key):
    """Processes a metadatablock and adds it to the database

    Args:
        block: The metadatablock to process
        foreign_key: The parent Metadatablock model instance to associate fields with
    """

    for field_name, value in block:
        if field_name.startswith("_"):
            continue
        elif value is None:
            continue
        elif value == []:
            continue

        # Get the field info to populate descriptions
        field_info = block.model_fields[field_name]

        if not field_info.json_schema_extra["typeClass"] == "compound":
            _create_and_save(
                model=Field,
                metadatablock=foreign_key,
                **_process_primitive(field_name, value, field_info, None),
            )

            continue

        if not isinstance(value, list):
            value = [value]

        for entry in value:
            compound = _create_and_save(
                model=Compound,
                metadatablock=foreign_key,
                name=field_name,
            )

            _process_compound(entry, compound)


def _process_compound(compound, foreign_key):
    """Processes a compound field and adds it to the database

    Args:
        compound: The compound field to process
        foreign_key: The parent Compound model instance to associate fields with
    """

    for field_name, value in compound:
        if field_name.startswith("_") or value is None:
            continue

        # Get the field info to populate descriptions
        field_info = compound.model_fields[field_name]

        _create_and_save(
            model=Field,
            compound=foreign_key,
            **_process_primitive(field_name, value, field_info, foreign_key),
        )


def _process_primitive(name, value, field_info, parent):
    """Processes a primitive field and prepares it for database storage

    Args:
        name: The name of the field
        value: The value of the field
        field_info: Metadata information about the field
        parent: The parent compound field (if applicable)

    Returns:
        A dictionary of field attributes for database storage
    """

    if isinstance(value, list):
        value = ", ".join(value)

    return {
        "name": name,
        "description": field_info.description,
        "value": str(value),
        "history": {f"Original": str(value)},
    }


def _is_empty(metadatablock: DataverseBase) -> bool:
    """Checks whether a metadatablock is empty

    Args:
        metadatablock: The metadatablock to check for emptiness

    Returns:
        bool: True if the metadatablock is empty, False otherwise
    """

    if not hasattr(metadatablock, "model_fields"):
        return True

    empty = True

    for field_name, value in metadatablock:
        field_info = metadatablock.model_fields[field_name]

        is_multiple = field_info.json_schema_extra.get("multiple", False)  # type: ignore
        is_compound = field_info.json_schema_extra["typeClass"] == "compound"  # type: ignore

        if is_compound and is_multiple:
            empty = all([_is_empty(entry) for entry in value])
        elif is_compound:
            empty = _is_empty(value)
        elif is_multiple:
            empty = all([val is None for val in value])
        else:
            empty = value is None

        if empty is False:
            return empty

    return empty

from django.core.exceptions import FieldDoesNotExist
from rest_framework import status
from rest_framework.response import Response
from reviews.models import Review

from .serializers import ReviewSerializer


def review_by_doi(request, doi):
    """
    Retrieve reviews associated with a specific DOI.

    Args:
        request: The HTTP request object.
        doi (str): The Digital Object Identifier to filter reviews by.

    Returns:
        Response: A DRF response containing a list of serialized reviews matching the DOI.
    """
    reviews = Review.objects.filter(doi=doi)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


def review_by_reviewer(request, reviewerid):
    """
    Retrieve reviews associated with a specific reviewer.

    Args:
        request: The HTTP request object.
        reviewerid (int): The ID of the reviewer to filter reviews by.

    Returns:
        Response: A DRF response containing a list of serialized reviews by the reviewer.
    """
    reviews = Review.objects.filter(reviewer=reviewerid)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)


def get_field_count(request, review_id):
    """
    Calculate the total and accepted field count for a specific review.

    Args:
        request: The HTTP request object.
        review_id (int): The primary key of the review to analyze.

    Returns:
        Response: A DRF response containing the total field count and number of accepted fields.
    """
    # Get total field count
    primitive_fields = list(
        Review.objects.filter(pk=review_id).values_list(
            "metadatablocks__primitives__accepted",
            flat=True,
        )
    )

    compound_fields = list(
        Review.objects.filter(pk=review_id).values_list(
            "metadatablocks__compounds__primitives__accepted",
            flat=True,
        )
    )

    field_count = len(primitive_fields) + len(compound_fields) - 1
    accepted_fields = len(
        list(filter(lambda x: x is True, primitive_fields + compound_fields))
    )

    return Response(
        {
            "field_count": field_count,
            "accpected_count": accepted_fields,
        },
        status=status.HTTP_200_OK,
    )

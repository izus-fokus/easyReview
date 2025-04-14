from rest_framework import status
from rest_framework.response import Response
from reviews.models import File

from .serializers import FileSerializer


def files_by_review_id(request, id):
    """Retrieve files associated with a specific review.

    Args:
        request: The HTTP request object.
        id (int): The ID of the review to fetch files for.

    Returns:
        Response: A DRF response containing a list of serialized files for the given review.
    """
    files = File.objects.get(review=id)

    if not isinstance(files, list):
        files = [files]

    serializer = FileSerializer(files, many=True)
    return Response(serializer.data)

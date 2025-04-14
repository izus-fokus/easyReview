import concurrent.futures
import re
from typing import Any, Dict, List

from rest_framework import status
from rest_framework.response import Response

import requests
from reviews.models import Review


def fetch_open_metadatablock_fields_for_review(review_pk: str) -> Dict[str, Any]:
    """
    Fetch open metadatablock fields for a specific review.

    This function retrieves metadatablock fields from a Dataverse repository
    for a given review, including primitive and compound fields.

    Args:
        review_pk (str): The primary key of the review to fetch fields for.

    Returns:
        Response: A DRF response containing a list of metadatablock fields,
                  or a 404 error if the review does not exist.
    """
    related_fields = [
        "metadatablocks",
        "metadatablocks__primitives",
        "metadatablocks__compounds",
        "metadatablocks__compounds__primitives",
    ]
    review = (
        Review.objects.prefetch_related(*related_fields).filter(id=review_pk).first()
    )

    if review is None:
        return Response(
            {"message": f"Review with ID '{review_pk}' does not exist."},
            status=status.HTTP_404_NOT_FOUND,
        )

    site_url = review.site_url

    if site_url.endswith("/"):
        site_url = site_url[:-1]

    url = "{site_url}/api/metadatablocks/{metadatablock_id}"

    return Response(
        data=[
            _fetch_open_metadatablock_fields(
                metadatablock,
                url.format(site_url=site_url, metadatablock_id=metadatablock.name),
            )
            for metadatablock in review.metadatablocks.all()
        ],
        status=status.HTTP_200_OK,
    )


def _fetch_open_metadatablock_fields(metadatablock, url: str) -> Dict[str, Any]:
    """
    Fetch and process open fields for a specific metadatablock.

    Args:
        metadatablock: The metadatablock object to process.
        url (str): The API endpoint URL to fetch metadatablock fields.

    Returns:
        Dict[str, Any]: A dictionary containing the metadatablock name,
                        primitive fields, and compound fields.
    """
    response = requests.get(url)
    response.raise_for_status()

    fields = response.json()["data"]["fields"]

    with concurrent.futures.ThreadPoolExecutor() as executor:
        primitives = executor.submit(_retrieve_primitives, fields)
        compounds = executor.submit(_retrieve_compounds, fields)
        primitives = primitives.result()
        compounds = compounds.result()

    # Remove all primitives that are in compound fields
    all_compound_fields = [
        compound_field
        for compound in compounds
        for compound_field in compound["childFields"]
    ]

    primitives = [
        primitive for primitive in primitives if primitive not in all_compound_fields
    ]

    return {
        "name": metadatablock.name,
        "primitives": primitives,
        "compounds": compounds,
    }


def _get_child_field_names(fields: Dict) -> List[str]:
    """
    Extract child field names from a dictionary of fields.

    Args:
        fields (Dict): A dictionary of fields to extract child field names from.

    Returns:
        List[str]: A list of child field names.
    """
    return [
        child_field["name"]
        for field in fields.values()
        for child_field in field.get("childFields", {}).values()
    ]


def _retrieve_primitives(fields: Dict) -> List[Dict]:
    """
    Retrieve primitive field names from a dictionary of fields.

    Args:
        fields (Dict): A dictionary of fields to extract primitive names from.

    Returns:
        List[Dict]: A list of primitive field names in snake_case.
    """
    child_field_names = _get_child_field_names(fields)
    return [
        field["displayName"].replace(" ", "_").lower()
        for field in fields.values()
        if field["displayName"] not in child_field_names and "childFields" not in field
    ]


def _retrieve_compounds(fields: Dict) -> List[Dict]:
    """
    Retrieve compound field information from a dictionary of fields.

    Args:
        fields (Dict): A dictionary of fields to extract compound fields from.

    Returns:
        List[Dict]: A list of compound fields with their names and child fields.
    """
    compounds = []

    for field in fields.values():
        if "childFields" not in field:
            continue

        compound = {
            "name": field["displayName"].replace(" ", "_").lower(),
            "childFields": [
                child_field["displayName"].replace(" ", "_").lower()
                for child_field in field.get("childFields", {}).values()
            ],
        }

        compounds.append(compound)

    return compounds


def _in_review(name: str, fields) -> bool:
    """
    Check if a field name exists in a list of fields.

    Args:
        name (str): The name of the field to check.
        fields: A list of fields to search through.

    Returns:
        bool: True if the field name exists, False otherwise.
    """
    return any(field.name == name for field in fields)


def _to_extract(field: Dict, fields) -> bool:
    """
    Determine if a field should be extracted.

    Args:
        field (Dict): The field to check for extraction.
        fields: A list of existing fields.

    Returns:
        bool: True if the field should be extracted, False otherwise.
    """
    if field["multiple"] is True:
        return True

    return not _in_review(field["name"], fields)


def camel_to_snake(name):
    """
    Converts a camel case string to snake case.

    Args:
        name (str): The camel case string to be converted.

    Returns:
        str: The snake case representation of the input string.
    """
    name = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", clean_name(name))
    return re.sub("([a-z0-9])([A-Z])", r"\1_\2", name).lower()


def clean_name(name):
    """
    Removes anything that is not a valid variable name.

    Args:
        name (str): The name to be cleaned.

    Returns:
        str: The cleaned name with invalid characters removed.
    """
    return re.sub(r"[^\w\s_]", " ", name).strip()

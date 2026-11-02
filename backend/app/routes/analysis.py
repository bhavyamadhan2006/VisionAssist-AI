from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter()


ALLOWED_CONTENT_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}

MAX_FILE_SIZE = 5 * 1024 * 1024


@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...)):
    """
    Phase 2 image-analysis endpoint.

    This endpoint validates the uploaded image.
    Gemini AI integration will be connected after
    the upload flow is confirmed to be working.
    """

    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid image format. "
                "Please upload a JPEG, PNG, or WebP image."
            ),
        )

    image_data = await file.read()

    if not image_data:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty.",
        )

    if len(image_data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="Image size must not exceed 5 MB.",
        )

    return {
        "status": "success",
        "message": "Image received successfully.",
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": len(image_data),
        "safety_level": "safe",
        "navigation_message": (
            "Image received. AI analysis will be processed next."
        ),
        "scene_description": "Image upload test successful.",
        "objects": [],
        "warning": (
            "This is currently an image-upload test response. "
            "AI detection will be connected in the next step."
        ),
    }
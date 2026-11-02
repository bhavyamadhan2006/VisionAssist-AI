from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import tempfile
import re

from app.services.gemini_service import analyze_image

router = APIRouter()


@router.post("/vision/analyze")
async def analyze_vision(image: UploadFile = File(...)):
    """
    Receive a captured camera image, send it to Gemini,
    and convert the Gemini response into a structured
    VisionAssist AI result.
    """

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPEG, PNG, or WebP image.",
        )

    image_data = await image.read()

    if not image_data:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty.",
        )

    if len(image_data) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image size must not exceed 5 MB.",
        )

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".jpg",
        ) as temp_file:
            temp_file.write(image_data)
            temp_path = temp_file.name

        gemini_result = analyze_image(temp_path)

        if gemini_result.get("status") != "success":
            return {
                "status": "error",
                "message": gemini_result.get(
                    "message",
                    "Gemini analysis failed.",
                ),
            }

        analysis_text = gemini_result.get(
            "analysis",
            "",
        )

        # ------------------------------------------
        # READ GEMINI RESPONSE
        # ------------------------------------------

        status_match = re.search(
            r"Status:\s*(SAFE|CAUTION|STOP)",
            analysis_text,
            re.IGNORECASE,
        )

        obstacle_match = re.search(
            r"Obstacle:\s*(.+)",
            analysis_text,
            re.IGNORECASE,
        )

        direction_match = re.search(
            r"Direction:\s*(LEFT|RIGHT|FORWARD|BACKWARD|STOP)",
            analysis_text,
            re.IGNORECASE,
        )

        voice_match = re.search(
            r"Voice:\s*(.+)",
            analysis_text,
            re.IGNORECASE,
        )

        status = (
            status_match.group(1).lower()
            if status_match
            else "safe"
        )

        obstacle = (
            obstacle_match.group(1).strip()
            if obstacle_match
            else "None"
        )

        direction = (
            direction_match.group(1).lower()
            if direction_match
            else "forward"
        )

        voice = (
            voice_match.group(1).strip()
            if voice_match
            else "Please proceed carefully."
        )

        # ------------------------------------------
        # CONVERT STATUS
        # ------------------------------------------

        if status == "stop":
            safety_level = "stop"
            risk_level = "high"

        elif status == "caution":
            safety_level = "medium"
            risk_level = "medium"

        else:
            safety_level = "safe"
            risk_level = "low"

        # ------------------------------------------
        # DETERMINE OBJECT POSITION
        # ------------------------------------------

        obstacle_lower = obstacle.lower()

        if any(
            word in obstacle_lower
            for word in [
                "ahead",
                "front",
                "in front",
                "directly ahead",
            ]
        ):
            position = "center"

        elif direction == "left":
            position = "left"

        elif direction == "right":
            position = "right"

        elif direction == "forward":
            position = "center"

        else:
            position = "unknown"

        # ------------------------------------------
        # OBJECT LIST
        # ------------------------------------------

        objects = []

        if obstacle_lower not in {
            "none",
            "no obstacle",
            "unknown",
        }:
            objects.append(
                {
                    "name": obstacle,
                    "position": position,
                    "proximity": (
                        "near"
                        if safety_level == "stop"
                        else "medium"
                    ),
                    "risk_level": risk_level,
                }
            )

        # ------------------------------------------
        # FINAL STRUCTURED RESPONSE
        # ------------------------------------------

        return {
            "status": "success",
            "safety_level": safety_level,
            "navigation_message": voice,
            "scene_description": (
                "Indoor path analysis completed by Gemini AI."
            ),
            "objects": objects,
            "direction": direction,
            "warning": (
                "AI analysis may be inaccurate. "
                "Always verify the path before moving."
            ),
        }

    except Exception as error:
        return {
            "status": "error",
            "message": str(error),
        }

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
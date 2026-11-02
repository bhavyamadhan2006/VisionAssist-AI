import os

from dotenv import load_dotenv
from google import genai


# --------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------------------------

load_dotenv()


# --------------------------------------------------
# GEMINI API KEY
# --------------------------------------------------

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError(
        "GEMINI_API_KEY is not set in backend/.env"
    )


# --------------------------------------------------
# GEMINI CLIENT
# --------------------------------------------------

client = genai.Client(
    api_key=api_key
)


# --------------------------------------------------
# MODEL
# --------------------------------------------------

GEMINI_MODEL = "gemini-3.6-flash"


# --------------------------------------------------
# IMAGE ANALYSIS
# --------------------------------------------------

def analyze_image(image_path: str) -> dict:
    """
    Analyze one camera frame for immediate
    indoor navigation.

    The response is intentionally very short
    to reduce processing and response time.
    """

    try:

        # ------------------------------------------
        # READ IMAGE
        # ------------------------------------------

        with open(
            image_path,
            "rb"
        ) as image_file:

            image_data = image_file.read()


        # ------------------------------------------
        # SHORT NAVIGATION PROMPT
        # ------------------------------------------

        prompt = """
You are VisionAssist AI.

You help a visually impaired person
navigate indoors in real time.

Look ONLY at the immediate path.

Return EXACTLY four lines:

Status: SAFE, CAUTION, or STOP
Obstacle: short obstacle name or None
Direction: LEFT, RIGHT, FORWARD, BACKWARD, or STOP
Voice: one very short command

Rules:

SAFE = path is clear.

CAUTION = obstacle is present but
the person can move around it.

STOP = path is blocked or dangerous.

The Voice line must be extremely short.

Examples:

Status: SAFE
Obstacle: None
Direction: FORWARD
Voice: Move forward.

Status: CAUTION
Obstacle: Chair
Direction: LEFT
Voice: Move left.

Status: STOP
Obstacle: Person ahead
Direction: STOP
Voice: Stop.

Do not describe the room.
Do not describe colors.
Do not describe decoration.
Do not explain your answer.
Do not give multiple commands.
Only return the four required lines.
"""


        # ------------------------------------------
        # GEMINI CONTENT
        # ------------------------------------------

        contents = [
            {
                "text": prompt
            },
            {
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": image_data
                }
            }
        ]


        # ------------------------------------------
        # SEND TO GEMINI
        # ------------------------------------------

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=contents
        )


        # ------------------------------------------
        # GET RESPONSE
        # ------------------------------------------

        analysis = ""

        if response.text:
            analysis = response.text.strip()


        if not analysis:

            return {
                "status": "error",
                "message": (
                    "Gemini returned an empty response."
                )
            }


        print(
            "Gemini navigation result:"
        )

        print(analysis)


        return {
            "status": "success",
            "analysis": analysis
        }


    except Exception as error:

        print(
            "Gemini navigation error:"
        )

        print(str(error))


        return {
            "status": "error",
            "message": str(error)
        }


# --------------------------------------------------
# CONNECTION TEST
# --------------------------------------------------

def verify_gemini_connection() -> dict:

    try:

        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=(
                "Reply with only the word connected."
            )
        )


        message = (
            response.text.strip()
            if response.text
            else "connected"
        )


        return {
            "status": "success",
            "message": message
        }


    except Exception as error:

        return {
            "status": "error",
            "message": str(error)
        }
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000';


export async function getBackendHealth() {
  const response = await fetch(
    `${API_BASE_URL}/api/health`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Backend health check failed with status ${response.status}`
    );
  }

  return await response.json();
}


export async function getSystemHealth() {
  try {
    const data = await getBackendHealth();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error.message ||
        'Unable to connect to VisionAssist backend',
    };
  }
}


export async function analyzeImage(imageData) {
  if (!imageData) {
    throw new Error('No image was provided for analysis.');
  }

  let imageBlob;

  try {
    const response = await fetch(imageData);

    if (!response.ok) {
      throw new Error('Unable to prepare captured image.');
    }

    imageBlob = await response.blob();
  } catch (error) {
    throw new Error(
      error.message ||
        'Unable to prepare captured image for analysis.'
    );
  }

  const formData = new FormData();

  formData.append(
    'image',
    imageBlob,
    'visionassist-capture.jpg'
  );

  const response = await fetch(
    `${API_BASE_URL}/api/vision/analyze`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    let errorMessage =
      `Image analysis failed with status ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        errorMessage =
          typeof errorData.detail === 'string'
            ? errorData.detail
            : JSON.stringify(errorData.detail);
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}
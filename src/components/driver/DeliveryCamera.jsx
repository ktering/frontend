import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { FaCamera, FaUpload, FaRedoAlt } from "react-icons/fa"; // Main icons
import { uploadDeliveryPhoto } from "../../api/driver";

export default function DeliveryCamera() {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [status, setStatus] = useState("");
  const webcamRef = useRef(null);

  const handleCapture = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    setCapturedPhoto(imageSrc);
    setStatus("");
  };

  const handleReset = () => {
    setCapturedPhoto(null);
    setStatus("");
  };

  const base64ToBlob = (base64) => {
    if (!base64) return null;
    const arr = base64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const binary = atob(arr[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new Blob([array], { type: mime });
  };

  const handleUpload = async () => {
    if (!capturedPhoto) return setStatus("No photo captured!");
    setStatus("Uploading...");

    try {
      const blob = base64ToBlob(capturedPhoto);
      if (!blob) return setStatus("Invalid photo format");

      const formData = new FormData();
      const fileName = `delivery-${Date.now()}.jpg`;
      formData.append("photo", blob, fileName);

      const data = await uploadDeliveryPhoto(formData);

      if (data.success) {
        setStatus("Photo uploaded successfully!");
        setTimeout(() => setCapturedPhoto(null), 1200);
      } else {
        setStatus("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setStatus("Upload failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-24 bg-white">
      <h1 className="text-3xl font-bold text-primary mb-2">Delivery Proof</h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Capture a photo to confirm delivery. Make sure the package is visible.
      </p>

      <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 flex flex-col items-center w-96">
        {!capturedPhoto ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={320}
              height={240}
              videoConstraints={{ facingMode: "environment" }}
              className="rounded-xl border border-gray-300"
            />
            <button
              onClick={handleCapture}
              className="mt-4 w-full bg-primary hover:bg-red-700 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <FaCamera /> Capture Photo
            </button>
          </>
        ) : (
          <>
            <img
              src={capturedPhoto}
              alt="Captured"
              className="w-80 h-60 object-cover rounded-xl border border-gray-300"
            />
            <div className="flex gap-4 mt-4 w-full">
              <button
                onClick={handleUpload}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <FaUpload /> Upload
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <FaRedoAlt /> Retake
              </button>
            </div>
          </>
        )}

        {status && (
          <div
            className={`mt-4 text-center font-medium ${
              status.toLowerCase().includes("fail") || status.toLowerCase().includes("error")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

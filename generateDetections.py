import os
import json
import base64
import requests

API_URL = "https://detect.roboflow.com/sacrifice-zone-detector/2?api_key=bH3J3rDkcWS4WkWAFf8t"
frames_folder = "frames"
output_json = "detections.json"

all_detections = {}

# Get frames in order
frames = sorted(f for f in os.listdir(frames_folder) if f.endswith(".jpg"))

for frame_name in frames:
    frame_path = os.path.join(frames_folder, frame_name)
    
    with open(frame_path, "rb") as f:
        img_data = f.read()
    encoded = base64.b64encode(img_data).decode()

    response = requests.post(
        API_URL,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data=encoded
    )
    
    data = response.json()
    all_detections[frame_name] = data.get("predictions", [])

    print(f"Processed {frame_name}, found {len(all_detections[frame_name])} objects")

# Save all predictions
with open(output_json, "w") as f:
    json.dump(all_detections, f, indent=2)

print(f"Saved all detections to {output_json}")
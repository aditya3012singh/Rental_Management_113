from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from ultralytics import YOLO
from PIL import Image
import io
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Load your trained model (make sure best.pt is in same folder)
model = YOLO('best.pt')

# Allow your React dev server origin or all origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # you can add more allowed origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or use ["*"] to allow all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect-damage")
async def detect_damage(file: UploadFile = File(...)):
    try:
        # Read image bytes
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Run detection
        results = model.predict(source=image, imgsz=640, conf=0.16)  # lower conf threshold

        # Process results (YOLO returns list, take first)
        detections = results[0]
        boxes = detections.boxes.xyxy.cpu().numpy().tolist()
        scores = detections.boxes.conf.cpu().numpy().tolist()
        classes = detections.boxes.cls.cpu().numpy().tolist()

        # Prepare response
        response = []
        for box, score, cls in zip(boxes, scores, classes):
            response.append({
                "bbox": [round(coord, 2) for coord in box],  # xmin,ymin,xmax,ymax
                "confidence": round(score, 3),
                "class": int(cls),
                "class_name": model.names[int(cls)]
            })

        if len(response) != 0:
            return JSONResponse(content={"message": "No damage detected"}, status_code=200)

        return JSONResponse(content={"message": "Damage detected", "detections": response})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
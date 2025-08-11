import os
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import yaml
from ultralytics import YOLO

# Dataset directories
base_dir = Path('./synthetic_phone_damage_dataset')
images_train = base_dir / 'images' / 'train'
images_val = base_dir / 'images' / 'val'
labels_train = base_dir / 'labels' / 'train'
labels_val = base_dir / 'labels' / 'val'
for p in [images_train, images_val, labels_train, labels_val]:
    p.mkdir(parents=True, exist_ok=True)

def draw_phone(draw, bbox, color=(30,30,30)):
    x1,y1,x2,y2 = bbox
    draw.rounded_rectangle([x1,y1,x2,y2], radius=30, fill=color)
    pad = 12
    draw.rounded_rectangle([x1+pad, y1+pad, x2-pad, y2-pad], radius=20, fill=(10,10,10))

def add_crack(draw, bbox):
    x1,y1,x2,y2 = bbox
    sx = random.randint(x1+20, x2-20)
    sy = random.randint(y1+20, y2-20)
    points = [(sx, sy)]
    num_segments = random.randint(6,12)
    for _ in range(num_segments):
        nx = points[-1][0] + random.randint(-40, 40)
        ny = points[-1][1] + random.randint(10, 60)
        nx = max(x1+10, min(x2-10, nx))
        ny = max(y1+10, min(y2-10, ny))
        points.append((nx, ny))
    for w in [3,2,1]:
        draw.line(points, fill=(220,220,220), width=w)
    return points

def create_image(path_img, path_lbl, damaged=False):
    W, H = 640, 480
    bg = Image.new('RGB', (W,H), (200,200,200))
    draw = ImageDraw.Draw(bg)
    pw = random.randint(180, 300)
    ph = int(pw * random.uniform(1.5, 2.0))
    if ph > H - 80:
        ph = H - 80
    x1 = random.randint(50, W - pw - 50)
    y1 = random.randint(40, H - ph - 40)
    x2 = x1 + pw
    y2 = y1 + ph
    draw_phone(draw, (x1,y1,x2,y2))
    bbox_for_label = None
    if damaged:
        points = add_crack(draw, (x1+20, y1+20, x2-20, y2-20))
        xs = [p[0] for p in points]
        ys = [p[1] for p in points]
        cx1, cy1, cx2, cy2 = min(xs), min(ys), max(xs), max(ys)
        padx = 8
        pady = 8
        cx1 = max(0, cx1-padx)
        cy1 = max(0, cy1-pady)
        cx2 = min(W, cx2+padx)
        cy2 = min(H, cy2+pady)
        bbox_for_label = (cx1, cy1, cx2, cy2)
    bg = bg.filter(ImageFilter.GaussianBlur(radius=random.uniform(0,0.6)))
    bg.save(path_img, quality=90)
    if damaged and bbox_for_label:
        x_center = (bbox_for_label[0] + bbox_for_label[2]) / 2.0 / W
        y_center = (bbox_for_label[1] + bbox_for_label[3]) / 2.0 / H
        bw = (bbox_for_label[2] - bbox_for_label[0]) / W
        bh = (bbox_for_label[3] - bbox_for_label[1]) / H
        with open(path_lbl, 'w') as f:
            f.write(f"0 {x_center:.6f} {y_center:.6f} {bw:.6f} {bh:.6f}\n")
    else:
        open(path_lbl, 'w').close()

# Create dataset
print("Creating synthetic dataset...")
for i in range(80):
    damaged = random.random() < 0.6
    create_image(images_train / f"train_{i:03d}.jpg", labels_train / f"train_{i:03d}.txt", damaged)

for i in range(20):
    damaged = random.random() < 0.5
    create_image(images_val / f"val_{i:03d}.jpg", labels_val / f"val_{i:03d}.txt", damaged)

print("Dataset created.")

# Create data.yaml
data_yaml = {
    'path': str(base_dir.resolve()),
    'train': 'images/train',
    'val': 'images/val',
    'nc': 1,
    'names': ['damage']
}
with open('data.yaml', 'w') as f:
    yaml.dump(data_yaml, f)

print("data.yaml created:")
print(data_yaml)

# Train YOLOv8
print("Starting training...")
model = YOLO('yolov8n.pt')
model.train(data='data.yaml', epochs=10, imgsz=640, batch=8, augment=True)
print("Training complete.")

# Copy best.pt to current directory
best_model_path = Path('runs/detect/train/weights/best.pt')
if best_model_path.exists():
    os.rename(best_model_path, 'best.pt')
    print("best.pt saved to current directory.")
else:
    print(f"best.pt not found at {best_model_path.resolve()}!")
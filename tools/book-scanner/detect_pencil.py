"""
Book Scanner - Pencil Line Detection Only (no OCR dependency)
Usage: python detect_pencil.py <image_path>
"""

import cv2
import numpy as np
import json
import sys
from pathlib import Path

if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


def fix_rotation(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=100,
                            minLineLength=100, maxLineGap=10)

    if lines is not None:
        angles = []
        for line in lines:
            line_arr = np.array(line).flatten()
            if len(line_arr) >= 4:
                x1, y1, x2, y2 = line_arr[:4]
                angle = np.degrees(np.arctan2(y2 - y1, x2 - x1))
                if abs(abs(angle) - 90) < 30 or abs(angle) < 30:
                    angles.append(angle)

        if angles:
            median_angle = np.median(angles)
            if abs(median_angle) > 45:
                if median_angle > 0:
                    img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
                else:
                    img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
    return img


def detect_pencil_lines(img):
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()

    kernel_h = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
    horizontal = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel_h)
    _, pencil_mask = cv2.threshold(horizontal, 120, 255, cv2.THRESH_BINARY)

    h, w = gray.shape
    margin_h = int(h * 0.1)
    margin_w = int(w * 0.1)
    pencil_mask[:margin_h, :] = 0
    pencil_mask[-margin_h:, :] = 0
    pencil_mask[:, :margin_w] = 0
    pencil_mask[:, -margin_w:] = 0

    contours, _ = cv2.findContours(pencil_mask, cv2.RETR_EXTERNAL,
                                   cv2.CHAIN_APPROX_SIMPLE)

    underlined_regions = []
    for cnt in contours:
        x, y, w_cnt, h_cnt = cv2.boundingRect(cnt)
        if w_cnt > 20 and h_cnt < 10:
            underlined_regions.append({
                'x': int(x),
                'y': int(y),
                'width': int(w_cnt),
                'height': int(h_cnt)
            })

    return underlined_regions, pencil_mask


def main():
    if len(sys.argv) < 2:
        print("Usage: python detect_pencil.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: File {image_path} not found")
        sys.exit(1)

    print(f"Image loaded: {img.shape[1]}x{img.shape[0]}")
    img = fix_rotation(img)
    print("Rotation fixed")

    regions, mask = detect_pencil_lines(img)
    print(f"\nFound {len(regions)} pencil line regions:")

    for i, r in enumerate(regions):
        print(f"  {i+1}. Position: ({r['x']}, {r['y']}), Size: {r['width']}x{r['height']}")

    mask_path = Path(image_path).stem + "_pencil_mask.png"
    cv2.imwrite(mask_path, mask)
    print(f"\nPencil mask saved: {mask_path}")


if __name__ == '__main__':
    main()

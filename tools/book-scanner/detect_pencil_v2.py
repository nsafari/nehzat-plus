"""
Book Scanner - Improved Pencil Underline Detection
Focuses on finding lines BELOW text that are lighter than printed text
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


def detect_text_regions(gray):
    _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 3))
    dilated = cv2.dilate(binary, kernel, iterations=2)
    
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    text_regions = []
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        if w > 10 and h > 5 and w < gray.shape[1] * 0.8:
            text_regions.append({'x': x, 'y': y, 'width': w, 'height': h})
    
    return text_regions


def detect_pencil_lines_v2(img):
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()

    text_regions = detect_text_regions(gray)

    pencil_candidates = []
    
    for threshold in [140, 150, 160, 170, 180]:
        kernel_h = cv2.getStructuringElement(cv2.MORPH_RECT, (30, 1))
        horizontal = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel_h)
        
        _, pencil_mask = cv2.threshold(horizontal, threshold, 255, cv2.THRESH_BINARY)
        
        h, w = gray.shape
        margin_h = int(h * 0.15)
        margin_w = int(w * 0.15)
        pencil_mask[:margin_h, :] = 0
        pencil_mask[-margin_h:, :] = 0
        pencil_mask[:, :margin_w] = 0
        pencil_mask[:, -margin_w:] = 0
        
        kernel_dilate = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 1))
        pencil_mask = cv2.dilate(pencil_mask, kernel_dilate, iterations=1)
        
        contours, _ = cv2.findContours(pencil_mask, cv2.RETR_EXTERNAL,
                                       cv2.CHAIN_APPROX_SIMPLE)
        
        for cnt in contours:
            x, y, w_cnt, h_cnt = cv2.boundingRect(cnt)
            
            if w_cnt < 30 or h_cnt > 15:
                continue
            
            has_text_above = False
            for tr in text_regions:
                if (abs(tr['y'] + tr['height'] - y) < 20 and
                    x < tr['x'] + tr['width'] and
                    x + w_cnt > tr['x']):
                    has_text_above = True
                    break
            
            if has_text_above:
                is_duplicate = False
                for existing in pencil_candidates:
                    if (abs(existing['x'] - x) < 20 and
                        abs(existing['y'] - y) < 10):
                        is_duplicate = True
                        break
                
                if not is_duplicate:
                    pencil_candidates.append({
                        'x': int(x),
                        'y': int(y),
                        'width': int(w_cnt),
                        'height': int(h_cnt),
                        'threshold': threshold,
                        'confidence': min(1.0, w_cnt / 100.0)
                    })

    return pencil_candidates, text_regions


def main():
    if len(sys.argv) < 2:
        print("Usage: python detect_pencil_v2.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: File {image_path} not found")
        sys.exit(1)

    print(f"Image loaded: {img.shape[1]}x{img.shape[0]}")
    img = fix_rotation(img)
    print("Rotation fixed")

    candidates, text_regions = detect_pencil_lines_v2(img)
    
    print(f"\nText regions found: {len(text_regions)}")
    print(f"Pencil line candidates: {len(candidates)}")
    
    for i, c in enumerate(candidates):
        print(f"  {i+1}. Position: ({c['x']}, {c['y']}), "
              f"Size: {c['width']}x{c['height']}, "
              f"Threshold: {c['threshold']}, "
              f"Confidence: {c['confidence']:.2f}")

    if len(sys.argv) > 2 and sys.argv[2] == '--save-mask':
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) if len(img.shape) == 3 else img
        mask = np.zeros_like(gray)
        for c in candidates:
            mask[c['y']:c['y']+c['height'], c['x']:c['x']+c['width']] = 255
        mask_path = Path(image_path).stem + "_pencil_mask_v2.png"
        cv2.imwrite(mask_path, mask)
        print(f"\nMask saved: {mask_path}")

    result_path = Path(image_path).stem + "_pencil_result.json"
    with open(result_path, 'w', encoding='utf-8') as f:
        json.dump({
            'source': image_path,
            'text_regions_count': len(text_regions),
            'pencil_candidates': candidates
        }, f, ensure_ascii=False, indent=2)
    print(f"Result saved: {result_path}")


if __name__ == '__main__':
    main()

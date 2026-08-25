"""
Book Scanner - استخراج متن و تشخیص خط مدادی
Usage: python scanner.py <image_path> [--output text|json|both] [--detect-lines]
"""

import cv2
import numpy as np
import easyocr
import json
import sys
import os
from pathlib import Path
from PIL import Image
import argparse

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
            elif abs(median_angle) > 5:
                h, w = img.shape[:2]
                center = (w // 2, h // 2)
                M = cv2.getRotationMatrix2D(center, median_angle, 1.0)
                img = cv2.warpAffine(img, M, (w, h),
                                     flags=cv2.INTER_CUBIC,
                                     borderMode=cv2.BORDER_REPLICATE)
    return img


def enhance_for_ocr(img):
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()

    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(denoised)
    return enhanced


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


def extract_text_easyocr(img, reader):
    if len(img.shape) == 3:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()

    results = reader.readtext(gray, detail=1)

    text_lines = []
    word_data = {'text': [], 'left': [], 'top': [], 'width': [], 'height': []}

    sorted_results = sorted(results, key=lambda r: (r[0][0][1], -r[0][0][0]))

    current_y = None
    line_words = []

    for (bbox, text, conf) in sorted_results:
        x1, y1 = int(bbox[0][0]), int(bbox[0][1])
        x2, y2 = int(bbox[2][0]), int(bbox[2][1])
        w = x2 - x1
        h = y2 - y1

        word_data['text'].append(text)
        word_data['left'].append(x1)
        word_data['top'].append(y1)
        word_data['width'].append(w)
        word_data['height'].append(h)

        if current_y is None or abs(y1 - current_y) > h * 0.5:
            if line_words:
                text_lines.append(' '.join(line_words))
            line_words = [text]
            current_y = y1
        else:
            line_words.append(text)

    if line_words:
        text_lines.append(' '.join(line_words))

    return '\n'.join(text_lines), word_data


def match_underlines_to_words(text_data, underlined_regions):
    underlined_words = []

    for i, word in enumerate(text_data['text']):
        if not word.strip():
            continue

        x = text_data['left'][i]
        y = text_data['top'][i]
        w = text_data['width'][i]
        h = text_data['height'][i]

        for region in underlined_regions:
            if (abs(y + h - region['y']) < 15 and
                x < region['x'] + region['width'] and
                x + w > region['x']):
                underlined_words.append({
                    'word': word,
                    'x': int(x), 'y': int(y),
                    'width': int(w), 'height': int(h),
                    'line_region': region
                })
                break

    return underlined_words


def process_image(image_path, output_mode='both', detect_lines=True):
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: File {image_path} not found")
        return None

    print(f"Image loaded: {img.shape[1]}x{img.shape[0]}")

    img = fix_rotation(img)
    print("Rotation fixed")

    print("Loading EasyOCR (first time may take a moment)...")
    reader = easyocr.Reader(['fa', 'en'], gpu=False)

    text, text_data = extract_text_easyocr(img, reader)
    print(f"Text extracted: {len(text)} characters")

    result = {
        'source': str(image_path),
        'text': text,
        'underlined_words': []
    }

    if detect_lines:
        underlined_regions, pencil_mask = detect_pencil_lines(img)
        print(f"Pencil line regions: {len(underlined_regions)}")

        if underlined_regions:
            underlined_words = match_underlines_to_words(text_data, underlined_regions)
            result['underlined_words'] = underlined_words
            print(f"Underlined words: {len(underlined_words)}")

            for item in underlined_words:
                print(f"  -> {item['word']}")

    return result


def main():
    parser = argparse.ArgumentParser(description='Book Scanner')
    parser.add_argument('image', help='Path to image file')
    parser.add_argument('--output', choices=['text', 'json', 'both'],
                       default='both', help='Output format')
    parser.add_argument('--no-lines', action='store_true',
                       help='Skip pencil line detection')

    args = parser.parse_args()

    result = process_image(
        args.image,
        output_mode=args.output,
        detect_lines=not args.no_lines
    )

    if result is None:
        sys.exit(1)

    output_path = Path(args.image).stem

    if args.output in ('text', 'both'):
        text_file = f"{output_path}_text.txt"
        with open(text_file, 'w', encoding='utf-8') as f:
            f.write(result['text'])
            if result['underlined_words']:
                f.write('\n\n--- Underlined Words ---\n')
                for item in result['underlined_words']:
                    f.write(f"{item['word']}\n")
        print(f"Text saved: {text_file}")

    if args.output in ('json', 'both'):
        json_file = f"{output_path}_result.json"
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"JSON saved: {json_file}")

    print("\n=== Summary ===")
    print(f"Extracted text: {len(result['text'])} characters")
    print(f"Underlined words: {len(result['underlined_words'])} items")
    if result['underlined_words']:
        print("Words: ", end="")
        print(", ".join([item['word'] for item in result['underlined_words']]))


if __name__ == '__main__':
    main()

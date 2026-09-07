import type { DomainProgress, TraineeDomainKey } from '../models/lesson-planner.models';

export const TRAINEE_DOMAIN_KEYS: TraineeDomainKey[] = [
  'scientific',
  'spiritual',
  'physical',
  'artistic',
  'social',
  'career'
];

export const TRAINEE_DOMAIN_LABELS: Record<TraineeDomainKey, string> = {
  scientific: 'علمی-فناورانه',
  spiritual: 'اعتقادی-عبادی',
  physical: 'زیستی-بدنی',
  artistic: 'زیباشناختی-هنری',
  social: 'اجتماعی-سیاسی',
  career: 'اقتصادی-حرفه‌ای'
};

export const TRAINEE_DOMAIN_ICONS: Record<TraineeDomainKey, string> = {
  scientific: '📐',
  spiritual: '📜',
  physical: '🏃',
  artistic: '🎨',
  social: '🤝',
  career: '💼'
};

export function emptyDomainProgress(): DomainProgress[] {
  return TRAINEE_DOMAIN_KEYS.map((key) => ({
    key,
    labelFa: TRAINEE_DOMAIN_LABELS[key],
    icon: TRAINEE_DOMAIN_ICONS[key],
    score: 0
  }));
}

export interface RadarAxisValue {
  label: string;
  value: number;
}

export interface RadarChartOptions {
  size?: number;
  chartRadius?: number;
  ringColor?: string;
  axisColor?: string;
  fillColor?: string;
  strokeColor?: string;
  dotColor?: string;
  labelColor?: string;
}

function radialPoint(cx: number, cy: number, radius: number, angle: number): [number, number] {
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
}

function ringPoints(cx: number, cy: number, radius: number, angles: number[]): string {
  return angles
    .map((angle) => radialPoint(cx, cy, radius, angle))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
}

function splitLabel(label: string): string[] {
  const parts = label.split('-');
  if (parts.length === 2 && parts[0].trim() && parts[1].trim()) {
    return parts;
  }
  return [label];
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function generateRadarChartSvg(axes: RadarAxisValue[], options: RadarChartOptions = {}): string {
  if (axes.length === 0) {
    return '';
  }
  const size = options.size ?? 320;
  const chartRadius = options.chartRadius ?? size * 0.3;
  const cx = size / 2;
  const cy = size / 2;
  const angles = axes.map((_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / axes.length);
  const values = axes.map((axis) => clampPercent(axis.value));
  const rings = 4;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" class="lp-radar-svg" style="display:block;width:100%;height:auto;direction:rtl;">`
  );

  for (let ring = rings; ring > 0; ring--) {
    const radius = (chartRadius * ring) / rings;
    const points = ringPoints(cx, cy, radius, angles);
    parts.push(
      `<polygon points="${points}" fill="var(--lp-surface, #ffffff)" stroke="${options.ringColor ?? 'var(--lp-border, #ddd5c5)'}" stroke-width="0.6" opacity="0.55"/>`
    );
  }

  for (const angle of angles) {
    const [x2, y2] = radialPoint(cx, cy, chartRadius, angle);
    parts.push(
      `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${options.axisColor ?? 'var(--lp-border, #ddd5c5)'}" stroke-width="0.6" opacity="0.7"/>`
    );
  }

  const valuePoints = angles
    .map((angle, i) => radialPoint(cx, cy, (chartRadius * values[i]) / 100, angle))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
  parts.push(
    `<polygon points="${valuePoints}" fill="${options.fillColor ?? 'var(--lp-primary, #1a6b3c)'}" fill-opacity="0.22" stroke="${options.strokeColor ?? 'var(--lp-primary, #1a6b3c)'}" stroke-width="1.6" stroke-linejoin="round"/>`
  );

  angles.forEach((angle, i) => {
    const value = values[i];
    if (value <= 0) {
      return;
    }
    const [rx, ry] = radialPoint(cx, cy, (chartRadius * value) / 100, angle);
    parts.push(
      `<circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="2.6" fill="${options.dotColor ?? 'var(--lp-gold, #b8942e)'}"/>`
    );
  });

  axes.forEach((axis, i) => {
    const angle = angles[i];
    const [lx, ly] = radialPoint(cx, cy, chartRadius + 16, angle);
    const cosAngle = Math.cos(angle);
    const anchor = Math.abs(cosAngle) < 0.2 ? 'middle' : cosAngle > 0 ? 'start' : 'end';
    const dir = Math.abs(cosAngle) < 0.2 ? 0 : Math.sign(cosAngle);
    const textX = lx + dir * 4;
    const lines = splitLabel(axis.label);
    const tspans = lines
      .map(
        (line, li) =>
          `<tspan x="${textX.toFixed(1)}" dy="${li === 0 ? 0 : 8.5}">${escapeXml(line)}</tspan>`
      )
      .join('');
    parts.push(
      `<text x="${textX.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" fill="${options.labelColor ?? 'var(--lp-text, #1e1b14)'}" font-size="7.5" font-weight="500" font-family="inherit" style="direction:rtl;">${tspans}</text>`
    );
  });

  parts.push('</svg>');
  return parts.join('');
}

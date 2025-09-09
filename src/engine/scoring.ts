export interface ScoreContext {
  year: number;
  totalYears: number;
}

export const pointsForFunding = new Map([
  ['small', 2],
  ['medium', 4],
  ['large', 6],
  ['industry', 5],
  ['government', 7]
]);

export const pointsForCollab = new Map([
  ['local', 1],
  ['national', 3],
  ['international', 5],
  ['interdisciplinary', 4]
]);

export const pointsForProgress = new Map([
  ['basic', 1],
  ['applied', 2],
  ['breakthrough', 4],
  ['theory', 2]
]);

export const gradeBands = {
  low: { min: 0, max: 10, multiplier: 1 },
  moderate: { min: 11, max: 20, multiplier: 2 },
  high: { min: 21, max: 30, multiplier: 3 },
  breakthrough: { min: 31, max: Infinity, multiplier: 5 }
};

export function calculateProjectPoints(project: any): number {
  let points = 0;
  
  if (project.funding) {
    points += pointsForFunding.get(project.funding.type) || 0;
  }
  
  if (project.collaboration) {
    points += pointsForCollab.get(project.collaboration.type) || 0;
  }
  
  if (project.progress) {
    points += pointsForProgress.get(project.progress.type) || 0;
  }
  
  return points;
}

export function getGradeBand(points: number): string {
  for (const [band, config] of Object.entries(gradeBands)) {
    if (points >= config.min && points <= config.max) {
      return band;
    }
  }
  return 'low';
}

export function calculatePublicationBonus(band: string): number {
  return gradeBands[band as keyof typeof gradeBands]?.multiplier || 1;
}

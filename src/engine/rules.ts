export interface Token {
  funding: number;
  collaboration: number;
  special: number;
}

export interface TradeReward {
  type: 'funding' | 'collaboration' | 'special' | 'card';
  amount?: number;
  cardType?: string;
}

export interface PublishResult {
  points: number;
  band: string;
  carryOver: number;
}

export interface YearContext {
  year: number;
  totalYears: number;
  previousScore: number;
}

const characterStartingTokens = new Map<string, Token>([
  ['biologist', { funding: 2, collaboration: 1, special: 1 }],
  ['engineer', { funding: 3, collaboration: 0, special: 1 }],
  ['socialscientist', { funding: 1, collaboration: 2, special: 1 }],
  ['chemist', { funding: 2, collaboration: 1, special: 1 }],
  ['computerscientist', { funding: 1, collaboration: 1, special: 2 }]
]);

export function grantStartingTokens(characterId: string): Token {
  return characterStartingTokens.get(characterId) || { funding: 1, collaboration: 1, special: 1 };
}

export function applyTradeResult(success: boolean): TradeReward[] {
  if (!success) return [];
  
  // On successful trade, player gets to choose one reward
  return [
    { type: 'funding', amount: 1 },
    { type: 'collaboration', amount: 1 },
    { type: 'special', amount: 1 },
    { type: 'card', cardType: 'research' }
  ];
}

export function publishAndScore(
  player: any, 
  yearContext: YearContext
): { updatedTotals: any; carryOver: number } {
  let totalPoints = 0;
  const completedProjects = [];
  
  // Calculate points from completed projects
  for (const project of player.projects) {
    if (project.funding && project.collaboration && project.progress) {
      const projectPoints = calculateProjectPoints(project);
      totalPoints += projectPoints;
      completedProjects.push({ ...project, points: projectPoints });
    }
  }
  
  // Determine grade band and publication bonus
  const band = getGradeBand(totalPoints);
  const bonus = calculatePublicationBonus(band);
  const finalScore = totalPoints * bonus;
  
  // Calculate carry-over for next year (10% of current score)
  const carryOver = Math.floor(finalScore * 0.1);
  
  // Update player totals
  const updatedTotals = {
    ...player,
    score: (player.score || 0) + finalScore,
    publications: {
      ...player.publications,
      [band]: (player.publications?.[band] || 0) + 1
    },
    completedProjects: [
      ...(player.completedProjects || []),
      ...completedProjects
    ],
    carryOverTokens: carryOver
  };
  
  return { updatedTotals, carryOver };
}

function calculateProjectPoints(project: any): number {
  let points = 0;
  
  if (project.funding?.type) {
    const fundingPoints = new Map([
      ['small', 2], ['medium', 4], ['large', 6], 
      ['industry', 5], ['government', 7]
    ]);
    points += fundingPoints.get(project.funding.type) || 0;
  }
  
  if (project.collaboration?.type) {
    const collabPoints = new Map([
      ['local', 1], ['national', 3], 
      ['international', 5], ['interdisciplinary', 4]
    ]);
    points += collabPoints.get(project.collaboration.type) || 0;
  }
  
  if (project.progress?.type) {
    const progressPoints = new Map([
      ['basic', 1], ['applied', 2], 
      ['breakthrough', 4], ['theory', 2]
    ]);
    points += progressPoints.get(project.progress.type) || 0;
  }
  
  return points;
}

function getGradeBand(points: number): string {
  if (points >= 31) return 'breakthrough';
  if (points >= 21) return 'high';
  if (points >= 11) return 'moderate';
  return 'low';
}

function calculatePublicationBonus(band: string): number {
  const bonuses = { low: 1, moderate: 2, high: 3, breakthrough: 5 };
  return bonuses[band as keyof typeof bonuses] || 1;
}

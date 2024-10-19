// src/types/heuristics.ts

export interface HeuristicScore {
    name: string;
    score: number;
  }
  
  export interface PageEvaluation {
    id: string;
    name: string;
    image: string;
    scores: HeuristicScore[];
  }
  
  export interface HeuristicsData {
    scores: HeuristicScore[];
    overallScore: number;
    pageEvaluations: PageEvaluation[];
  }
  
  
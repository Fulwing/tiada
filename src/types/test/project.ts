export interface TestSetupData {
    testName: string;
    productType: string;
    productDescription: string;
    taskDescription: string;
    taskInstruction: string;
    evaluationMetrics: {
        taskCompletionSteps: boolean;
        taskCompletionPercentage: number;
        taskUltimateSuccess: boolean;
        completionTime: boolean;
        usersSubjectiveFeedback: boolean;
        heuristicsEvaluation: boolean;
    };
    relatedWebsites: string[];
    coreId: string; // andrew i added core id in here
}
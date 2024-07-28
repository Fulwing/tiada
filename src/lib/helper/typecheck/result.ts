import { TestResult } from "@/types/test/result";


export function isTestResult(obj: any): obj is TestResult {
    return obj && typeof obj === 'object'
        && 'id' in obj
        && 'taskCompletion' in obj
        && 'steps' in obj
        && 'name' in obj
        && 'gender' in obj
        && 'age' in obj
        && 'occupation' in obj
        && 'completionTime' in obj
        && 'persona' in obj
        && 'stages' in obj
        && 'generalFeedback' in obj
        && 'personaId' in obj
        && 'coreId' in obj
        && typeof obj.taskCompletion === 'string'
        && typeof obj.steps === 'number'
        && typeof obj.name === 'string'
        && typeof obj.gender === 'string'
        && typeof obj.age === 'number'
        && typeof obj.occupation === 'string'
        && typeof obj.completionTime === 'number'
        && (typeof obj.persona === 'undefined' || (
            typeof obj.persona === 'object' &&
            'name' in obj.persona &&
            'age' in obj.persona &&
            'gender' in obj.persona &&
            'occupation' in obj.persona &&
            'location' in obj.persona &&
            'characteristic' in obj.persona &&
            typeof obj.persona.name === 'string' &&
            typeof obj.persona.age === 'number' &&
            typeof obj.persona.gender === 'string' &&
            typeof obj.persona.occupation === 'string' &&
            typeof obj.persona.location === 'string' &&
            typeof obj.persona.characteristic === 'string'
        ))
        && Array.isArray(obj.stages)
        && typeof obj.generalFeedback === 'string'
        && typeof obj.personaId === 'string'
        && typeof obj.coreId === 'string';
}
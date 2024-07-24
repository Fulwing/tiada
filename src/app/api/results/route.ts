// src/app/api/results/route.ts

// Import necessary modules from Next.js server and project types
import { NextResponse } from 'next/server';
import { TestResult, Step } from '../../../types/test/result';

// Handle GET requests to the /api/results endpoint
export async function GET() {
    const mockResults: TestResult[] = [
        {
            id: 1,
            taskCompletion: 'Success',
            steps: 7,
            name: 'John',
            gender: 'Male',
            age: 28,
            occupation: 'PM', // Project Manager
            completionTime: 320, // Time in seconds
            stages: [
                { 
                    stepNumber: 1, 
                    status: 'success', 
                    description: 'Logged in successfully', 
                    image: '/rectangle-6.png',
                    userAction: "I will enter my username and password in the login form and click the 'Login' button.",
                    userExplanation: "I expect to be redirected to the main dashboard after successful login, where I can access all project management features."
                },
                // Additional steps follow the same structure
                { 
                    stepNumber: 2, 
                    status: 'success', 
                    description: 'Navigated to project dashboard', 
                    image: '/rectangle-6.png',
                    userAction: "I will click on the 'Projects' tab in the main navigation menu.",
                    userExplanation: "This should take me to a page showing an overview of all current projects, including their status and key metrics."
                },
                { 
                    stepNumber: 3, 
                    status: 'success', 
                    description: 'Created new task', 
                    image: '/rectangle-6.png',
                    userAction: "I will click the 'New Task' button, likely located in the top right corner of the project dashboard.",
                    userExplanation: "This should open a form where I can input details for a new task, such as title, description, and priority."
                },
                { 
                    stepNumber: 4, 
                    status: 'success', 
                    description: 'Assigned task to team member', 
                    image: '/rectangle-6.png',
                    userAction: "In the new task form, I will use the 'Assign To' dropdown to select a team member.",
                    userExplanation: "This dropdown should list all team members available for task assignment. After selecting, the task will be linked to that team member's workload."
                },
                { 
                    stepNumber: 5, 
                    status: 'success', 
                    description: 'Set due date', 
                    image: '/rectangle-6.png',
                    userAction: "I will use the date picker in the task form to set a due date for the task.",
                    userExplanation: "The date picker should allow me to easily select a future date. This will help in tracking deadlines and managing the project timeline."
                },
                { 
                    stepNumber: 6, 
                    status: 'success', 
                    description: 'Added task description', 
                    image: '/rectangle-6.png',
                    userAction: "I will type a detailed description of the task in the provided text area.",
                    userExplanation: "This description should clearly outline what needs to be done, providing enough information for the assigned team member to understand and complete the task."
                },
                { 
                    stepNumber: 7, 
                    status: 'success', 
                    description: 'Saved and exited', 
                    image: '/rectangle-6.png',
                    userAction: "I will click the 'Save' or 'Create Task' button at the bottom of the form.",
                    userExplanation: "This should save all the entered information and create the new task in the system. I expect to see a confirmation message and be redirected back to the project dashboard or task list."
                },
            ],
            generalFeedback: "John completed all steps successfully, demonstrating a clear understanding of the task creation process. His efficiency in navigating the interface and attention to detail in task assignment and description showcases his project management skills.",
            persona: {
                name: "John",
                age: 28,
                gender: "Male",
                occupation: "Project Manager",
                location: "New York, NY",
                characteristic: "John is a detail-oriented project manager with 5 years of experience in tech startups. He's known for his ability to streamline complex processes and keep teams motivated throughout project lifecycles."
            },
        },
        {
            id: 2,
            taskCompletion: 'Failed',
            steps: 7,
            name: 'Alice',
            gender: 'Female',
            age: 32,
            occupation: 'Developer',
            completionTime: 450,
            stages: [
                { 
                    stepNumber: 1, 
                    status: 'success', 
                    description: 'Logged in successfully', 
                    image: '/rectangle-6.png',
                    userAction: "I will enter my username and password in the login form and click the 'Login' button.",
                    userExplanation: "I expect to be redirected to the main dashboard after successful login, where I can access all project management features."
                },
                { 
                    stepNumber: 2, 
                    status: 'miss', 
                    description: 'Failed to navigate to project dashboard', 
                    image: '/rectangle-6.png',
                    userAction: "I will click on the 'Projects' tab in the main navigation menu.",
                    userExplanation: "This should take me to a page showing an overview of all current projects, including their status and key metrics."
                },
                { 
                    stepNumber: 3, 
                    status: 'success', 
                    description: 'Created new task', 
                    image: '/rectangle-6.png',
                    userAction: "I will click the 'New Task' button, likely located in the top right corner of the project dashboard.",
                    userExplanation: "This should open a form where I can input details for a new task, such as title, description, and priority."
                },
                { 
                    stepNumber: 4, 
                    status: 'miss', 
                    description: 'Failed to assign task to team member', 
                    image: '/rectangle-6.png',
                    userAction: "In the new task form, I will use the 'Assign To' dropdown to select a team member.",
                    userExplanation: "This dropdown should list all team members available for task assignment. After selecting, the task will be linked to that team member's workload."
                },
                { 
                    stepNumber: 5, 
                    status: 'success', 
                    description: 'Set due date', 
                    image: '/rectangle-6.png',
                    userAction: "I will use the date picker in the task form to set a due date for the task.",
                    userExplanation: "The date picker should allow me to easily select a future date. This will help in tracking deadlines and managing the project timeline."
                },
                { 
                    stepNumber: 6, 
                    status: 'miss', 
                    description: 'Failed to add task description', 
                    image: '/rectangle-6.png',
                    userAction: "I will type a detailed description of the task in the provided text area.",
                    userExplanation: "This description should clearly outline what needs to be done, providing enough information for the assigned team member to understand and complete the task."
                },
                { 
                    stepNumber: 7, 
                    status: 'success', 
                    description: 'Saved and exited', 
                    image: '/rectangle-6.png',
                    userAction: "I will click the 'Save' or 'Create Task' button at the bottom of the form.",
                    userExplanation: "This should save all the entered information and create the new task in the system. I expect to see a confirmation message and be redirected back to the project dashboard or task list."
                },
            ],
            generalFeedback: "Alice encountered several issues during the process, indicating a need for clearer instructions or improvements in the interface design.",
            persona: {
                name: "Alice",
                age: 32,
                gender: "Female",
                occupation: "Developer",
                location: "San Francisco, CA",
                characteristic: "Alice is a seasoned developer with a knack for problem-solving. However, she struggled with the interface, suggesting a potential gap in user experience design."
            },
        },
        {
            id: 3,
            taskCompletion: 'Success',
            steps: 7,
            name: 'Bob',
            gender: 'Male',
            age: 45,
            occupation: 'Designer',
            completionTime: 380,
            stages: [
                { 
                    stepNumber: 1, 
                    status: 'success', 
                    description: 'Logged in successfully', 
                    image: '/rectangle-6.png',
                    userAction: "I will enter my username and password in the login form and click the 'Login' button.",
                    userExplanation: "I expect to be redirected to the main dashboard after successful login, where I can access all project management features."
                },
                { 
                    stepNumber: 2, 
                    status: 'success', 
                    description: 'Navigated to project dashboard', 
                    image: '/rectangle-6.png',
                    userAction: "I will click on the 'Projects' tab in the main navigation menu.",
                    userExplanation: "This should take me to a page showing an overview of all current projects, including their status and key metrics."
                },
                { 
                    stepNumber: 3, 
                    status: 'success', 
                    description: 'Created new task', 
                    image: '/rectangle-6.png',
                    userAction: "I will click the 'New Task' button, likely located in the top right corner of the project dashboard.",
                    userExplanation: "This should open a form where I can input details for a new task, such as title, description, and priority."
                },
                { 
                    stepNumber: 4, 
                    status: 'success', 
                    description: 'Assigned task to team member', 
                    image: '/rectangle-6.png',
                    userAction: "In the new task form, I will use the 'Assign To' dropdown to select a team member.",
                    userExplanation: "This dropdown should list all team members available for task assignment. After selecting, the task will be linked to that team member's workload."
                },
                { 
                    stepNumber: 5, 
                    status: 'miss', 
                    description: 'Failed to set due date', 
                    image: '/rectangle-6.png',
                    userAction: "I will use the date picker in the task form to set a due date for the task.",
                    userExplanation: "The date picker should allow me to easily select a future date. This will help in tracking deadlines and managing the project timeline."
                },
                { 
                    stepNumber: 6, 
                    status: 'success', 
                    description: 'Added task description', 
                    image: '/rectangle-6.png',
                    userAction: "I will type a detailed description of the task in the provided text area.",
                    userExplanation: "This description should clearly outline what needs to be done, providing enough information for the assigned team member to understand and complete the task."
                },
                { 
                    stepNumber: 7, 
                    status: 'success', 
                    description: 'Saved and exited', 
                    image: '/rectangle-6.png',
                    userAction: "I will click the 'Save' or 'Create Task' button at the bottom of the form.",
                    userExplanation: "This should save all the entered information and create the new task in the system. I expect to see a confirmation message and be redirected back to the project dashboard or task list."
                },
            ],
            generalFeedback: "Bob was able to complete most steps successfully, with only one minor issue that did not significantly impact the overall task completion.",
            persona: {
                name: "Bob",
                age: 45,
                gender: "Male",
                occupation: "Designer",
                location: "Los Angeles, CA",
                characteristic: "Bob is an experienced designer with a keen eye for detail. His ability to navigate the interface efficiently highlights the intuitive aspects of the design."
            },
        },
    ];

    // Log the GET request
    console.log("GET request to /api/results");
    // Return the mock results as JSON response
    return NextResponse.json(mockResults);
}



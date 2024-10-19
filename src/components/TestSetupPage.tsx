// src/components/TestSetupPage.tsx

'use client';

import React, { useState } from 'react';
import NavigationBar from './NavigationBar';
import TestInformation from './TestInformation';
import TestingMission from './TestingMission';
import EvaluationMetrics from './EvaluationMetrics';
import SupportDocumentation from './SupportDocumentation';
import { submitTestSetup } from '../app/api/testSetup';

const TestSetupPage: React.FC = () => {
  const [testName, setTestName] = useState('');
  const [productType, setProductType] = useState('new');
  const [productDescription, setProductDescription] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskInstruction, setTaskInstruction] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState(150);
  const [relatedWebsites, setRelatedWebsites] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isTestInfoSaved, setIsTestInfoSaved] = useState(false);
  const [isTestingMissionSaved, setIsTestingMissionSaved] = useState(false);
  const [isEvaluationMetricsSaved, setIsEvaluationMetricsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSaveTestInfo = () => {
    if (testName && productDescription) {
      setIsTestInfoSaved(true);
    }
  };

  const handleSaveTestingMission = () => {
    if (taskDescription && taskInstruction) {
      setIsTestingMissionSaved(true);
    }
  };

  const handleSaveEvaluationMetrics = () => {
    if (selectedMetrics.length > 0) {
      setIsEvaluationMetricsSaved(true);
    }
  };

  const handleSave = () => {
    if (!isTestInfoSaved) {
      handleSaveTestInfo();
    } else if (!isTestingMissionSaved) {
      handleSaveTestingMission();
    } else if (!isEvaluationMetricsSaved) {
      handleSaveEvaluationMetrics();
    }
  };

  const handleFinishUpload = async () => {
    if (isSubmitting) return;
  
    setIsSubmitting(true);
    const testSetupData = {
      testName,
      productType,
      productDescription,
      taskDescription,
      taskInstruction,
      evaluationMetrics: {
        taskCompletionSteps: selectedMetrics.includes('Task Completion Steps'),
        taskCompletionPercentage: sliderValue,
        taskUltimateSuccess: selectedMetrics.includes('Task Ultimate Success'),
        completionTime: selectedMetrics.includes('Completion Time'),
        usersSubjectiveFeedback: selectedMetrics.includes('Users\' subjective feedback'),
        heuristicsEvaluation: selectedMetrics.includes('Heuristics Evaluation'),
      },
      relatedWebsites,
      coreId: 'user-core-id', // Replace this with the actual user ID when available
    };

    console.log('Submitting test setup data:', testSetupData);
    console.log('Uploading files:', uploadedFiles.map(f => f.name));
  
    try {
      const result = await submitTestSetup(testSetupData, uploadedFiles);
      console.log('Test setup submitted successfully:', result);
      alert('Test setup submitted successfully!');
      // TODO: Handle successful submission (e.g., redirect to next page)
    } catch (error: any) {
      console.error('Failed to submit test setup:', error);
      alert(`Failed to submit test setup. Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSaveButtonActive = 
    (!isTestInfoSaved && testName && productDescription) || 
    (isTestInfoSaved && !isTestingMissionSaved && taskDescription && taskInstruction) ||
    (isTestingMissionSaved && !isEvaluationMetricsSaved && selectedMetrics.length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      <NavigationBar />
      <main className="flex flex-1 p-2">
        <div className="flex flex-col w-[707px] p-[5px_14px] gap-2 relative border-r border-[#444]">
          <TestInformation
            testName={testName}
            setTestName={setTestName}
            productType={productType}
            setProductType={setProductType}
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            onSave={handleSaveTestInfo}
            isMinimized={isTestInfoSaved}
          />
          <TestingMission
            isExpanded={isTestInfoSaved}
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            taskInstruction={taskInstruction}
            setTaskInstruction={setTaskInstruction}
            onSave={handleSaveTestingMission}
            isMinimized={isTestingMissionSaved}
          />
          <EvaluationMetrics 
            isExpanded={isTestingMissionSaved}
            isMinimized={isEvaluationMetricsSaved}
            selectedMetrics={selectedMetrics}
            setSelectedMetrics={setSelectedMetrics}
            sliderValue={sliderValue}
            setSliderValue={setSliderValue}
          />
          <button
            className={`absolute right-4 bottom-4 ${
              isSaveButtonActive ? 'bg-[#625AFA]' : 'bg-[#5C5C60]'
            } text-[#C9D1D9] py-1 px-4 rounded-md text-base font-medium`}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
        <SupportDocumentation
      relatedWebsites={relatedWebsites}
      setRelatedWebsites={setRelatedWebsites}
      uploadedFiles={uploadedFiles}
      setUploadedFiles={setUploadedFiles}
      onFinishUpload={handleFinishUpload}
      isSubmitting={isSubmitting}
    />

      </main>
    </div>
  );
};

export default TestSetupPage;


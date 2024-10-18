# API Documentation

## 1. **Start AI Test** (`/api/ai/test`)

### **Description**
This endpoint starts the AI test process, invoked by the "Start Testing" button on the last step of the Generate Persona page. It sends details about the job and test configurations.

### **Method**
`POST`

### **Request Body**
The request body should be in JSON format and contain the following fields:

```json
{
  "jobDetails": "string",
  "homePageId": "string",
  "coreId": "string",
  "totalStepsAllowed": "number"
}
```

| Field              | Type     | Description                                    |
|--------------------|----------|------------------------------------------------|
| `jobDetails`       | `string` | Details about the AI test job.                 |
| `homePageId`       | `string` | ID of the home page where testing will begin.  |
| `coreId`           | `string` | The user ID initiating the test (Core ID).     |
| `totalStepsAllowed`| `number` | Maximum number of steps allowed for the test.  |

### **Response**
The response will confirm if the AI test was successfully initiated.

- **Status**: `200 OK` (Success)
  
```json
{
  "message": "AI test initiated successfully",
  "testId": "string"
}
```

| Field      | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| `message`  | `string` | Success message.                            |
| `testId`   | `string` | Unique identifier for the initiated AI test. |


## 2. **Submit Annotations** (`/api/submitAnnotations`)

### **Description**
This endpoint allows submitting annotation data for screens in the test process. It includes coordinates, labels, and other details for each screen and annotation.

### **Method**
`POST`

### **Request Body**
The request body should be in JSON format and contain the following fields:

```json
{
  "screens": [
    {
      "id": "string",
      "image": "string",
      "annotations": [
        {
          "id": "string",
          "label": "string",
          "coordinates": {
            "x": "number",
            "y": "number",
            "width": "number",
            "height": "number"
          },
          "leadsTo": "string",
          "isCorrectPath": "boolean"
        }
      ]
    }
  ],
  "coreId": "string",
  "testProjectId": "string"
}
```

| Field                | Type      | Description                                                |
|----------------------|-----------|------------------------------------------------------------|
| `screens`            | `array`   | Array of screens and their annotations.                    |
| `screens[].id`       | `string`  | Unique ID of the screen.                                   |
| `screens[].image`    | `string`  | Image filename representing the screen.                    |
| `annotations`        | `array`   | Array of annotations for the screen.                       |
| `annotations[].id`   | `string`  | Unique identifier of the annotation.                       |
| `annotations[].label`| `string`  | Name or label of the annotation.                           |
| `coordinates`        | `object`  | Coordinates and size of the annotation box.                |
| `coordinates.x`      | `number`  | X-coordinate of the annotation on the screen.              |
| `coordinates.y`      | `number`  | Y-coordinate of the annotation on the screen.              |
| `coordinates.width`  | `number`  | Width of the annotation box.                               |
| `coordinates.height` | `number`  | Height of the annotation box.                              |
| `leadsTo`            | `string`  | ID of the screen or page this annotation leads to.         |
| `isCorrectPath`      | `boolean` | Indicates if the annotation is on the correct test path.   |
| `coreId`             | `string`  | The user ID initiating the test (Core ID).                 |
| `testProjectId`      | `string`  | The project ID associated with the test.                   |

### **Response**
The response will confirm whether the annotations were successfully submitted.

- **Status**: `200 OK` (Success)
  
```json
{
  "message": "Annotations submitted successfully"
}
```

| Field      | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| `message`  | `string` | Success message.                            |


## 3. **Test Setup** (`/api/test-setup`)

### **Description**
This endpoint handles the initial setup of a test, including capturing test details, metrics, and related websites.

### **Method**
`POST`

### **Request Body**
The request body should be in JSON format and contain the following fields:

```json
{
  "testName": "string",
  "productType": "string",
  "productDescription": "string",
  "taskDescription": "string",
  "taskInstruction": "string",
  "evaluationMetrics": {
    "taskCompletionSteps": "boolean",
    "taskCompletionPercentage": "number",
    "taskUltimateSuccess": "boolean",
    "completionTime": "boolean",
    "usersSubjectiveFeedback": "boolean",
    "heuristicsEvaluation": "boolean"
  },
  "relatedWebsites": ["string"],
  "coreId": "string"
}
```

| Field                      | Type     | Description                                                |
|----------------------------|----------|------------------------------------------------------------|
| `testName`                 | `string` | Name of the test.                                           |
| `productType`              | `string` | Type of product being tested.                               |
| `productDescription`       | `string` | Description of the product.                                 |
| `taskDescription`          | `string` | Description of the task for users.                          |
| `taskInstruction`          | `string` | Instructions on how to perform the task.                    |
| `evaluationMetrics`        | `object` | Evaluation metrics for assessing test success.              |
| `taskCompletionSteps`      | `boolean`| Whether task completion steps are being tracked.            |
| `taskCompletionPercentage` | `number` | Percentage of the task completed to be tracked.             |
| `taskUltimateSuccess`      | `boolean`| Whether ultimate success of the task is evaluated.          |
| `completionTime`           | `boolean`| Whether the time to completion is being tracked.            |
| `usersSubjectiveFeedback`  | `boolean`| Whether user feedback is part of the evaluation.            |
| `heuristicsEvaluation`     | `boolean`| Whether heuristic evaluation is part of the test.           |
| `relatedWebsites`          | `array`  | List of related websites (URLs) for the product.            |
| `coreId`                   | `string` | The user ID initiating the test (Core ID).                  |

### **Response**
The response will confirm whether the test setup data was successfully submitted.

- **Status**: `200 OK` (Success)

```json
{
  "message": "Test setup submitted successfully",
  "testId": "string"
}
```

| Field      | Type     | Description                                 |
|------------|----------|---------------------------------------------|
| `message`  | `string` | Success message.                            |
| `testId`   | `string` | Unique identifier for the test setup.        |

---
# Maintenance Work Request
---
## env guide
PORT = 5000

DATABASE = "mysql://u:pw@localhost:3306/maintenance_work_request"

JWT_SECRET

CLOUDINARY_NAME 
CLOUDINARY_API_KEY 
CLOUDINARY_API_SECRET


## Authen path
|method |path |authen | params | query | role | level | body |
|:----- |:--- |:----:  |:------ |:----- |:---- |:---- |:---- |
|post|/auth/login|-|-|-|-|-|{ email, password }
|get|/auth/me|y|-|-|-|-|-|

## User path
|method |path |authen | params | query | role | level | body |
|:----- |:--- |:----:  |:------ |:----- |:---- |:---- |:---- |
|get|/user/|y|-|-|admin|-|-|
|post|/user/|y|y|-|admin|-|{firstName, lastName, email, password, confirmPassword, picture?, locationId, departmentId, role, level}
|patch|/user/:userId|y|y|-|admin|-|{firstName, lastName, email, password, confirmPassword, picture?, locationId, departmentId, role, level}
|delete|/user/:userId|y|y|-|admin|-|-|
|get|/user/|y|-|y|-|manager, leader|-|

## Request task path
|method |path |authen | params | query | role | level | body |
|:----- |:--- |:----:  |:------ |:----- |:---- |:---- |:---- |
|get|/request-task/|y|-|y|-|-|-|
|post|/request-task/|y|-|-|-|-|{employeeId, machineId, faultSymptoms, departmentId,images }
|patch|/request-task/:requestId|y|y|-|-|-|{employeeId, machineId, faultSymptoms, departmentId,images,status}
|delete|/request-task/:requestId|y|y|-|-|-|-|


## Maintenance task path
|method |path |authen | params | query | role | level | body |
|:----- |:--- |:----:  |:------ |:----- |:---- |:---- |:---- |
|get|/maintenance-task/|y|-|y|-|-|-|
|post|/maintenance-task/|y|-|-|-|-|{requestId, machineId, employeeId, typeOfFailureId, typeOfRootCauseId, rootCauseDetail?, operationDetails?, preventingRecurrence? equipmentUsed?, additionalSuggestions?, images?}
|patch|/maintenance-task/:maintenanceId|y|y|-|-|-|{requestId, machineId, employeeId, typeOfFailureId, typeOfRootCauseId, rootCauseDetail?, operationDetails?, preventingRecurrence? equipmentUsed?, additionalSuggestions?, finishTime?, acceptTime?, status, isRejected, images? }
|delete|/maintenance-task/:maintenanceId|y|y|-|-|-|-|


## Note
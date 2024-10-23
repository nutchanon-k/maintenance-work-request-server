# Maintenance Work Request
---
## env guide
PORT = 8000

DATABASE = "mysql://u:pw@localhost:3306/maintenance_work_request"

JWT_SECRET

CLOUDINARY_NAME 
CLOUDINARY_API_KEY 
CLOUDINARY_API_SECRET


## Authen path

| Method | Path                    | Auth Required | Params | Query | Role | Level | Body                          |
|--------|-------------------------|:-------------:|--------|-------|------|-------|-------------------------------|
| POST   | /auth/login             |       -       |   -    |   -   |   -  |   -   | { email, password }           |
| GET    | /auth/me                |       y       |   -    |   -   |   -  |   -   | -                             |
| POST   | /auth/forgot-password   |       -       |   -    |   -   |   -  |   -   | { email }                     |
| PATCH  | /auth/reset-password    |       y       |   -    |   -   |   -  |   -   | { password, confirmPassword } |

## User path

| Method | Path                    | Auth Required | Params | Query | Role            | Level           | Body                                                                                   |
|--------|-------------------------|:-------------:|--------|-------|-----------------|-----------------|----------------------------------------------------------------------------------------|
| GET    | /user/                  |       y       |   -    |   -   | admin           | -               | -                                                                                      |
| POST   | /user/                  |       y       |   y    |   -   | admin           | -               | { firstName, lastName, email, password, confirmPassword, picture?, locationId, departmentId, role, level } |
| PATCH  | /user/:userId           |       y       |   y    |   -   | admin           | -               | { firstName, lastName, email, password, confirmPassword, picture?, locationId, departmentId, role, level } |
| DELETE | /user/:userId           |       y       |   y    |   -   | admin           | -               | -                                                                                      |
| GET    | /user/assign-users      |       y       |   -    |   y   | admin, maintenance | manager, leader | -                                                                                      |
| GET    | /user/location-department-data      |       y       |   -    |   -   | admin | -   | -
| GET    | /user/user-detail/:userId     |       y       |   y    |   -   | admin | -   | -
| PATCH  | /user//change-password/:userId    |       y       |   y    |   -   | admin | -   | {oldPassword, newPassword, confirmNewPassword}

## Request task path

| Method | Path                                         | Auth Required | Params | Query | Role                  | Level | Body                                                   |
|--------|----------------------------------------------|:-------------:|--------|-------|-----------------------|-------|--------------------------------------------------------|
| GET    | /request-task/                               |       y       |   -    |   y   |   -                   |   -   | -                                                      |
| POST   | /request-task/                               |       y       |   -    |   -   |   admin , requester  |   -   | { employeeId, machineId, faultSymptoms, departmentId, images }  |
| PATCH  | /request-task/:requestId                     |       y       |   y    |   -   |   admin , requester  |   -   | { employeeId, machineId, faultSymptoms, departmentId, images, status }  |
| DELETE | /request-task/:requestId                     |       y       |   y    |   -   |   admin , requester  |   -   | -                                                      |
| GET    | /request-task/data-machine/:machineId        |       y       |   y    |   -   |   -                   |   -   | -                                                      |
| PATCH  | /request-task/isAssigned/:requestId          |       y       |   y    |   -   | admin , maintenance  |   leader , manager   | { isAssigned }-                                                      |
| PATCH  | /request-task/update-status/:requestId       |       y       |   y    |   -   |   admin , requester  |   -   | { status }                                                      |

## Maintenance task path

| Method | Path                                  | Auth Required | Params | Query | Role                  | Level                  | Body                                                                                                                   |
|--------|---------------------------------------|:-------------:|--------|-------|-----------------------|------------------------|------------------------------------------------------------------------------------------------------------------------|
| GET    | /maintenance-task/                    |       y       |   -    |   y   |   -                   |   -                    | -                                                                                                                      |
| POST   | /maintenance-task/                    |       y       |   -    |   -   | admin, maintenance     | leader, manager         | { requestId, machineId, employeeId, typeOfFailureId} |
| PATCH  | /maintenance-task/:maintenanceId      |       y       |   y    |   -   | admin, maintenance, requester | - | { requestId, machineId, employeeId, typeOfFailureId, typeOfRootCauseId, rootCauseDetail?, operationDetails?, preventingRecurrence?, equipmentUsed?, additionalSuggestions?, finishTime?, acceptTime?, status, isRejected, images? } |
| DELETE | /maintenance-task/:maintenanceId      |       y       |   y    |   -   | admin, maintenance     | leader, manager         | -                                                                                                                      |
| GET | /data-type-of-root-cause                 |       y       |   -    |   -   |   -                    | -         | -                                                                                                                      |
|PATCH| /update-status/:maintenanceId            |       y       |   y    |   -   |   admin, requester     | -         |  { status, acceptTime, isRejected, rejectReason }-                                                                                                                      |
|GET  | /data-root-cause-failure                 |       y       |   y    |   -   |   -                    | -         |   -                                                                                                                      |



## Note
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { faker } = require('@faker-js/faker');

// Define machine types (unchanged)
const machineTypes = {
  1: 'Hydraulic Deep Drawing Machine',
  2: 'Cutting Machine',
  3: 'Welding Machine',
  4: 'Annealing Machine',
  5: 'Sand Blasting Machine',
  6: 'Zinc Metalizing Machine',
  7: 'Painting Machine'
};

// Update validDataByMachineId to only include departmentId
const validDataByMachineId = {
  1: 5, 2: 5, 3: 5,    // Hydraulic Deep Drawing Machines in department 5
  4: 6, 5: 6,          // Cutting Machines in department 6
  6: 7, 7: 7, 8: 7,    // Welding Machines in department 7
  9: 8,                // Annealing Machine in department 8
  10: 9, 11: 9, 12: 9, // Sand Blasting Machines in department 9
  13: 10, 14: 10,      // Zinc Metalizing Machines in department 10
  15: 11               // Painting Machine in department 11
};

// Define failure types (unchanged)
const failureTypes = {
  1: 'Mechanical',
  2: 'Electrical',
  3: 'Tooling'
};

// Update rootCauseByFailureType (unchanged)
const rootCauseByFailureType = {
    1: [ // Mechanical
      { id: 1, details: 'Hydraulic Leak', machineTypeIds: [1] },
      { id: 2, details: 'Valve Jamming', machineTypeIds: [1] },
      { id: 3, details: 'Pump Failure', machineTypeIds: [1] },
      { id: 4, details: 'Filter Clogging', machineTypeIds: [1] },
      { id: 9, details: 'Lubrication System Failure', machineTypeIds: [2] },
      { id: 10, details: 'Worn Bearings', machineTypeIds: [2] },
      { id: 11, details: 'Damaged Shaft or Gears', machineTypeIds: [2] },
      { id: 12, details: 'Damaged Shaft or Gears', machineTypeIds: [2] },
      { id: 18, details: 'Faulty Clamping Mechanism', machineTypeIds: [3] },
      { id: 19, details: 'Irregular Movement of Mechanical Parts', machineTypeIds: [3] },
      { id: 20, details: 'Cooling System Failure', machineTypeIds: [3] },
      { id: 27, details: 'Material Conveyor System Failure', machineTypeIds: [4] },
      { id: 28, details: 'Damaged Internal Furnace Components', machineTypeIds: [4] },
      { id: 29, details: 'Burner Failure', machineTypeIds: [4] },
      { id: 34, details: 'Clogged or Damaged Nozzle', machineTypeIds: [5] },
      { id: 35, details: 'Insufficient Pressure', machineTypeIds: [5] },
      { id: 36, details: 'Dust Filtration System Malfunction', machineTypeIds: [5] },
      { id: 40, details: 'Dust Filtration System Malfunction', machineTypeIds: [5] },
      { id: 41, details: 'Clogged or Damaged Zinc Spray Nozzle', machineTypeIds: [6] },
      { id: 42, details: 'Material Conveyance System Failure', machineTypeIds: [6] },
      { id: 43, details: 'Inconsistent Air Pressure', machineTypeIds: [6] },
      { id: 48, details: 'Clogged Paint Gun or Nozzle', machineTypeIds: [7] },
      { id: 49, details: 'Reciprocator Movement Failure', machineTypeIds: [7] },
      { id: 50, details: 'Air Pressure Inconsistencies for Spray System', machineTypeIds: [7] },
      { id: 51, details: 'Conveyor System Malfunction', machineTypeIds: [7] }
    ],
    2: [ // Electrical
      { id: 5, details: 'Electrical Circuit Failure', machineTypeIds: [1] },
      { id: 6, details: 'Sensor Failure', machineTypeIds: [1] },
      { id: 13, details: 'Electrical Circuit Failure', machineTypeIds: [1] },
      { id: 14, details: 'Sensor Failure', machineTypeIds: [2] },
      { id: 15, details: 'Faulty Switch', machineTypeIds: [2] },
      { id: 21, details: 'Unstable Power Supply', machineTypeIds: [3] },
      { id: 22, details: 'Electrical Short Circuit', machineTypeIds: [3] },
      { id: 23, details: 'Blown Fuse', machineTypeIds: [3] },
      { id: 24, details: 'Inverter Malfunction', machineTypeIds: [3] },
      { id: 30, details: 'Temperature Control System Failure', machineTypeIds: [4] },
      { id: 31, details: 'Relay Malfunction', machineTypeIds: [4] },
      { id: 32, details: 'Electrical Short Circuit', machineTypeIds: [4] },
      { id: 37, details: 'Electric Motor Failure', machineTypeIds: [5] },
      { id: 38, details: 'Faulty Electrical Control Panel', machineTypeIds: [5] },
      { id: 44, details: 'Electric Motor Failure', machineTypeIds: [6] },
      { id: 45, details: 'Faulty Sensors', machineTypeIds: [6] },
      { id: 52, details: 'Electric Motor Failure', machineTypeIds: [7] },
      { id: 53, details: 'Faulty Motion Sensors', machineTypeIds: [7] },
      { id: 54, details: 'PLC Control System Failure', machineTypeIds: [7] }
    ],
    3: [ // Tooling
      { id: 7, details: 'Mold Damage', machineTypeIds: [1] },
      { id: 8, details: 'Die Sticking', machineTypeIds: [1] },
      { id: 16, details: 'Mold Damage', machineTypeIds: [2] },
      { id: 17, details: 'Incorrect Mold Setup', machineTypeIds: [2] },
      { id: 25, details: 'Damaged Fixture or Jig', machineTypeIds: [3] },
      { id: 26, details: 'Incorrect Workpiece Positioning in Fixture', machineTypeIds: [3] },
      { id: 33, details: 'Worn Mold Components', machineTypeIds: [4] },
      { id: 39, details: 'Mold Damaged by Blasting', machineTypeIds: [5] },
      { id: 46, details: 'Mold or Fixture Mismatch with Workpiece', machineTypeIds: [6] },
      { id: 47, details: 'Incorrect Workpiece Positioning', machineTypeIds: [6] },
      { id: 55, details: 'Paint Build-up on Molds or Fixtures', machineTypeIds: [7] },
      { id: 56, details: 'Improper Cleaning or Maintenance of Molds', machineTypeIds: [7] },
      { id: 57, details: 'Damaged or Worn Tooling', machineTypeIds: [7] }
    ]
  };
  

// Function to get random root cause based on machineTypeId and typeOfFailureId
async function getRandomRootCause(machineId, typeOfFailureId) {
  const machine = await prisma.machine.findUnique({
    where: { id: machineId },
    select: { id: true, departmentId: true, machineTypeId: true }
  });
  
  if (!machine) {
    throw new Error(`Machine with ID ${machineId} not found`);
  }

  const machineTypeId = machine.machineTypeId;

  console.log(machineTypeId)
  const rootCauses = rootCauseByFailureType[typeOfFailureId].filter(
    cause => cause.machineTypeIds.includes(machineTypeId)
  );
  console.log(rootCauses)

  if (rootCauses.length === 0) {
    throw new Error(`No root causes found for Machine Type ID: ${machineTypeId} Machine ID: ${machineId} and Failure Type ID: ${typeOfFailureId}`);
  }
  
  return faker.helpers.arrayElement(rootCauses);
}

// Function to check if the data is valid for a given machine
async function isValidDataForMachine(machineId, departmentId) {
  const machine = await prisma.machine.findUnique({
    where: { id: machineId },
    select: { departmentId: true }
  });
  return machine && machine.departmentId === departmentId;
}

async function seedTasks() {
    for (let i = 0; i < 50; i++) { // จำนวนครั้งในการสร้างข้อมูลจำลอง
      const machineId = faker.number.int({ min: 1, max: 15 });
  
      const machine = await prisma.machine.findUnique({
        where: { id: machineId },
        select: { id: true, departmentId: true, machineTypeId: true }
      });
  
      if (!machine) {
        console.error(`Machine ID ${machineId} not found.`);
        continue;
      }
  
      if (!(await isValidDataForMachine(machineId, machine.departmentId))) {
        console.error(`Machine ID ${machineId} has invalid department.`);
        continue;
      }

  
      // กำหนด requestTime ให้เป็นวันที่สุ่มในช่วง 30 วันที่ผ่านมา
      const requestTime = new Date(faker.date.recent(30));
  
      // สมมติว่า employeeId, machineId และ departmentId มีอยู่ในฐานข้อมูลแล้ว (เชื่อมโยง employeeId, machineId และ departmentId)
      const employeeId = faker.number.int({ min: 8, max: 16 });
      const departmentId = machine.departmentId;  // หรือใช้ id จริงของ Department ที่มีอยู่ในฐานข้อมูล
  
      // กำหนด updatedTime ที่ห่างจาก requestTime ไม่เกิน 4 ชั่วโมง
      const updatedTime = new Date(requestTime.getTime() + faker.number.int({ min: 1, max: 4 }) * 60 * 60 * 1000); // ห่างกัน 1-4 ชั่วโมง
  
      // สร้าง requestTask ที่มี status เป็น success
      const requestTask = await prisma.requestTask.create({
        data: {
          employee: {
            connect: { id: employeeId },  // ใช้ connect เพื่อเชื่อมโยงกับ employee ที่มีอยู่
          },
          machine: {
            connect: { id: machineId },  // ใช้ connect เพื่อเชื่อมโยงกับ machine ที่มีอยู่
          },
          department: {
            connect: { id: departmentId },  // ใช้ connect เพื่อเชื่อมโยงกับ department ที่มีอยู่
          },
          faultSymptoms: faker.lorem.sentence(),
          status: 'success',
          requestTime: requestTime.toISOString(),
          updatedTime: updatedTime.toISOString(),  // กำหนดค่า updatedTime ไม่เกิน 4 ชั่วโมงหลังจาก requestTime
          isAssigned: true,
        },
      });
  
      // กำหนด startTime ของ maintenanceTask ให้เริ่มภายใน 30 นาทีหลังจาก requestTime
      const startTime = new Date(requestTime.getTime() + faker.number.int({ min: 1, max: 30 }) * 60 * 1000); // เริ่มหลังจาก requestTime 1-30 นาที
      const finishTime = new Date(startTime.getTime() + faker.number.int({ min: 1, max: 3 }) * 60 * 60 * 1000); // เสร็จภายใน 1-3 ชั่วโมงหลังจาก startTime
      const acceptTime = new Date(finishTime.getTime() + faker.number.int({ min: 1, max: 15 }) * 60 * 1000); // ยอมรับภายใน 1-15 นาทีหลังจาก finishTime
  
      const typeOfFailureId = faker.helpers.arrayElement([1, 2, 3]);
      const rootCause = await getRandomRootCause(machineId, typeOfFailureId);
  
      const maintenanceTask = await prisma.maintenanceTask.create({
        data: {
          requestId: requestTask.id,
          machineId: requestTask.machineId,
          employeeId: faker.number.int({ min: 3, max: 7 }),
          typeOfFailureId: typeOfFailureId,
          typeOfRootCauseId: rootCause.id,
          rootCauseDetail: rootCause.details,
          operationDetails: faker.lorem.sentence(),
          preventingRecurrence: faker.lorem.sentence(),
          equipmentUsed: faker.commerce.product(),
          additionalSuggestions: faker.lorem.sentence(),
          startTime: startTime.toISOString(),
          finishTime: finishTime.toISOString(),
          acceptTime: acceptTime.toISOString(),
          status: 'success',
          isRejected: false,
          rejectReason: null,
        },
      });
  
      // อัพเดท updatedTime ของ requestTask ให้เท่ากับ acceptTime ของ maintenanceTask หากจำเป็น
      if (acceptTime > updatedTime) {
        await prisma.requestTask.update({
          where: { id: requestTask.id },
          data: { updatedTime: acceptTime.toISOString() },
        });
      }
    }
  }
  
  seedTasks()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
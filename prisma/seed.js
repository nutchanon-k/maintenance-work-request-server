const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


async function main() {
    // Seed Locations 
    const locations = await prisma.location.createMany({
      data: [
        { name: 'Office' },
        { name: 'Factory1' },
        { name: 'Factory2' },
        { name: 'Engineering Shop' }
      ],
      skipDuplicates: true // Skip if the location already exists
    });

  
    // Fetch Location List
    const locationList = await prisma.location.findMany();
    const engineeringShopLocation = locationList.find(location => location.name === 'Engineering Shop');
    const factory1Location = locationList.find(location => location.name === 'Factory1');
    const factory2Location = locationList.find(location => location.name === 'Factory2');
    const officeLocation = locationList.find(location => location.name === 'Office');

  

    // Seed Department
    const departments = await prisma.department.createMany({
      data :[
        {
          name: 'Mechanical',
          departmentType: 'Engineering',
          locationId: engineeringShopLocation.id
        },
        {
          name: 'Electrical',
          departmentType: 'Engineering',
          locationId: engineeringShopLocation.id 
        },
        {
          name: 'Tooling',
          departmentType: 'Engineering',
          locationId: engineeringShopLocation.id
        },
        {
          name: 'Production Central',
          departmentType: 'Engineering',
          locationId: engineeringShopLocation.id
        },
        {
          name: 'Deep Drawing',
          departmentType: 'Production',
          locationId: factory1Location.id 
        },
        {
          name: 'Cutting',
          departmentType: 'Production',
          locationId : factory1Location.id
        },
        {
          name: 'Welding',
          departmentType: 'Production',
          locationId: factory1Location.id
        },
        {
          name: 'Annealing',
          departmentType: 'Production',
          locationId: factory2Location.id
        },
        {
          name: 'Sand Blasting',
          departmentType: 'Production',
          locationId: factory2Location.id
        },
        {
          name: 'Zinc Metalizing',
          departmentType: 'Production',
          locationId:factory2Location.id  

        },
        {
          name: 'Painting',
          departmentType: 'Production',
          locationId: factory2Location.id
        }

      ]
    });
    // Fetch Department list
    const departmentList = await prisma.department.findMany();
    const mechanicalDept = departmentList.find(dept => dept.name === 'Mechanical');
    const electricalDept = departmentList.find(dept => dept.name === 'Electrical');
    const toolingDept = departmentList.find(dept => dept.name === 'Tooling');
    const productionCentralDept = departmentList.find(dept => dept.name === 'Production Central');
    const deepDrawingDept = departmentList.find(dept => dept.name === 'Deep Drawing');
    const cuttingDept = departmentList.find(dept => dept.name === 'Cutting');
    const weldingDept = departmentList.find(dept => dept.name === 'Welding');
    const annealingDept = departmentList.find(dept => dept.name === 'Annealing');
    const sandBlastingDept = departmentList.find(dept => dept.name === 'Sand Blasting');
    const zincMetalizingDept = departmentList.find(dept => dept.name === 'Zinc Metalizing');
    const paintingDept = departmentList.find(dept => dept.name === 'Painting');
  
    // Seed Machine Types
    const machineTypes = await prisma.machineType.createMany({
      data: [
        { details: 'Hydraulic Deep Drawing Machine' },
        { details: 'Cutting Machine' },
        { details: 'Welding Machine' },
        { details: 'Annealing Machine' },
        { details: 'Sand Blasting Machine' },
        { details: 'Zinc Metalizing Machine' },
        { details: 'Painting Machine' }
      ]
    });
  
    // Fetch machine types
    const machineTypeList = await prisma.machineType.findMany();
    const hydraulicMachineType = machineTypeList.find(type => type.details === 'Hydraulic Deep Drawing Machine');
    const cuttingMachineType = machineTypeList.find(type => type.details === 'Cutting Machine');
    const weldingMachineType = machineTypeList.find(type => type.details === 'Welding Machine');
    const annealingMachineType = machineTypeList.find(type => type.details === 'Annealing Machine');
    const sandBlastingMachineType = machineTypeList.find(type => type.details === 'Sand Blasting Machine');
    const zincMetalizingMachineType = machineTypeList.find(type => type.details === 'Zinc Metalizing Machine');
    const paintingMachineType = machineTypeList.find(type => type.details === 'Painting Machine');
  
    // Seed Machines
    const machines = await prisma.machine.createMany({
      data: [
      {
        name: 'Hydraulic Deep Drawing Machine A',
        locationId: factory1Location.id, 
        departmentId: deepDrawingDept.id, 
        machineTypeId: hydraulicMachineType.id 
      },
      {
        name: 'Hydraulic Deep Drawing Machine B',
        locationId: factory1Location.id, 
        departmentId: deepDrawingDept.id, 
        machineTypeId: hydraulicMachineType.id 
      },
      {
        name: 'Hydraulic Deep Drawing Machine C',
        locationId: factory1Location.id, 
        departmentId: deepDrawingDept.id, 
        machineTypeId: hydraulicMachineType.id 
      },
      {
        name: 'Cutting Machine A',
        locationId: factory1Location.id, 
        departmentId: cuttingDept.id, 
        machineTypeId: cuttingMachineType.id 
      },
      {
        name: 'Cutting Machine B',
        locationId: factory1Location.id, 
        departmentId: cuttingDept.id, 
        machineTypeId: cuttingMachineType.id 
      },
      {
        name: 'Welding Machine A',
        locationId: factory1Location.id, 
        departmentId: weldingDept.id, 
        machineTypeId: weldingMachineType.id 
      },
      {
        name: 'Welding Machine B',
        locationId: factory1Location.id, 
        departmentId: weldingDept.id, 
        machineTypeId: weldingMachineType.id 
      },
      {
        name: 'Welding Machine C',
        locationId: factory1Location.id, 
        departmentId: weldingDept.id, 
        machineTypeId: weldingMachineType.id 
      },
      {
        name: 'Annealing Machine A',
        locationId: factory2Location.id, 
        departmentId: annealingDept.id, 
        machineTypeId: annealingMachineType.id 
      },
      {
        name: 'Sand Blasting Machine A',
        locationId: factory2Location.id, 
        departmentId: sandBlastingDept.id, 
        machineTypeId: sandBlastingMachineType.id 
      },
      {
        name: 'Sand Blasting Machine B',
        locationId: factory2Location.id, 
        departmentId: sandBlastingDept.id, 
        machineTypeId: sandBlastingMachineType.id 
      },
      {
        name: 'Sand Blasting Machine C',
        locationId: factory2Location.id, 
        departmentId: sandBlastingDept.id, 
        machineTypeId: sandBlastingMachineType.id 
      },
      {
        name: 'Zinc Metalizing Machine A',
        locationId: factory2Location.id, 
        departmentId: zincMetalizingDept.id, 
        machineTypeId: zincMetalizingMachineType.id 
      },
      {
        name: 'Zinc Metalizing Machine B',
        locationId: factory2Location.id, 
        departmentId: zincMetalizingDept.id, 
        machineTypeId: zincMetalizingMachineType.id 
      },
      {
        name: 'Painting Machine A',
        locationId: factory2Location.id, 
        departmentId: paintingDept.id, 
        machineTypeId: paintingMachineType.id 
      }
    ]});
  
    // Fetch Machine List
    const machineList = await prisma.machine.findMany();
    const hydraulicMachine = machineList.find(machine => machine.name === 'Hydraulic Deep Drawing Machine A');
    const cuttingMachine = machineList.find(machine => machine.name === 'Cutting Machine A');
    const weldingMachine = machineList.find(machine => machine.name === 'Welding Machine A');
    const annealingMachine = machineList.find(machine => machine.name === 'Annealing Machine A');
    const sandBlastingMachine = machineList.find(machine => machine.name === 'Sand Blasting Machine A');
    const zincMetalizingMachine = machineList.find(machine => machine.name === 'Zinc Metalizing Machine A');
    const paintingMachine = machineList.find(machine => machine.name === 'Painting Machine A');
  

  
    // Hash password for employees
    const hashedPassword = bcrypt.hashSync('123456', 10);
  
    // Seed Employees
    const employees = await prisma.employee.createMany({
      data: [
        {
          firstName: 'John',
          lastName: 'Anderson',
          email: 'admin@gmail.com',
          password: hashedPassword,
          locationId: engineeringShopLocation.id,
          departmentId: mechanicalDept.id,
          role: 'admin',
          level: 'manager'
        },
        {
          firstName: 'Jack',
          lastName: 'Miller',
          email: 'jack@gmail.com',
          password: hashedPassword,
          locationId: engineeringShopLocation.id,
          departmentId: mechanicalDept.id,
          role: 'maintenance',
          level: 'leader'
        },
        {
          firstName: 'David',
          lastName: 'Thompson',
          email: 'david@gmail.com',
          password: hashedPassword,
          locationId: engineeringShopLocation.id,
          departmentId: electricalDept.id,
          role: 'maintenance',
          level: 'leader'
        },
        {
          firstName: 'Noah',
          lastName: 'Scott',
          email: 'noah@gmail.com',
          password: hashedPassword,
          locationId: engineeringShopLocation.id,
          departmentId: toolingDept.id,
          role: 'maintenance',
          level: 'leader'
        },

        {          
          firstName: 'Lucas',
          lastName: 'Richardson',
          email: 'lucas@gmail.com',
          password: hashedPassword,
          locationId: engineeringShopLocation.id,
          departmentId: mechanicalDept.id,
          role: 'maintenance',
          level: 'staff'
        },
        {
          firstName: 'Samuel',
          lastName: 'Brooks',
          email: 'samuel@gmail.com',
          password: hashedPassword,
          locationId: engineeringShopLocation.id,
          departmentId: electricalDept.id,
          role: 'maintenance',
          level: 'staff'
        },
        {
          firstName: 'Liam',
          lastName: 'Foster',
          email: 'liam@gmail.com',
          password: hashedPassword,
          locationId: engineeringShopLocation.id,
          departmentId: toolingDept.id,
          role: 'maintenance',
          level: 'staff'
        },
        {
          firstName: 'Matthew',
          lastName: 'Gray',
          email: 'matthew@example.com',
          password: hashedPassword,
          locationId: factory1Location.id,
          departmentId: productionCentralDept.id,
          role: 'requester',
          level: 'manager'
        },
        {
          firstName: 'Joshua',
          lastName: 'Lewis',
          email: 'joshua@example.com',
          password: hashedPassword,
          locationId: factory2Location.id,
          departmentId: productionCentralDept.id,
          role: 'requester',
          level: 'manager'
        },

        {
          firstName: 'Daniel',
          lastName: 'Cooper',
          email: 'daniel@example.com',
          password: hashedPassword,
          locationId: factory1Location.id,
          departmentId: deepDrawingDept.id,
          role: 'requester',
          level: 'staff'
        },
        {
          firstName: 'Henry',
          lastName: 'Morgan',
          email: 'henry@example.com',
          password: hashedPassword,
          locationId: factory1Location.id,
          departmentId: cuttingDept.id,
          role: 'requester',
          level: 'staff'
        },
        {
          firstName: 'Alexander',
          lastName: 'Hughes',
          email: 'alexander@example.com',
          password: hashedPassword,
          locationId: factory1Location.id,
          departmentId: weldingDept.id,
          role: 'requester',
          level: 'staff'
        },
        {
          firstName: 'Ryan',
          lastName: 'Edwards',
          email: 'ryan@example.com',
          password: hashedPassword,
          locationId: factory2Location.id,
          departmentId: annealingDept.id,
          role: 'requester',
          level: 'staff'
        },
        {
          firstName: 'Benjamin',
          lastName: 'Clark',
          email: 'benjamin@example.com',
          password: hashedPassword,
          locationId: factory2Location.id,
          departmentId: sandBlastingDept.id,
          role: 'requester',
          level: 'staff'
        },
        {
          firstName: 'Oliver',
          lastName: 'Hayes',
          email: 'oliver@example.com',
          password: hashedPassword,
          locationId: factory2Location.id,
          departmentId: zincMetalizingDept.id,
          role: 'requester',
          level: 'staff'
        },
        {
          firstName: 'Nathan',
          lastName: 'Roberts',
          email: 'nathan@example.com',
          password: hashedPassword,
          locationId: factory2Location.id,
          departmentId: paintingDept.id,
          role: 'requester',
          level: 'staff'
        },
      ]

    });
  
    // Seed Types of Failure
    const failures = await prisma.typeOfFailure.createMany({
      data: [
        { details: 'Mechanical' },
        { details: 'Electrical' },
        { details: 'Tooling' }
      ]
    });
  
    // Fetching the type of failures by name (after creation)
    const failureList = await prisma.typeOfFailure.findMany();
    const mechanicalFailure = failureList.find(failure => failure.details === 'Mechanical');
    const electricalFailure = failureList.find(failure => failure.details === 'Electrical');
    const toolingFailure = failureList.find(failure => failure.details === 'Tooling');
  
    // Seed Types of Root Causes for Hydraulic Machines
    const rootCauses = await prisma.typeOfRootCause.createMany({
      data: [
        {
          details: 'Hydraulic Leak',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: hydraulicMachineType.id
        },
        {
          details: 'Valve Jamming',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: hydraulicMachineType.id
        },
        {
          details: 'Pump Failure',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: hydraulicMachineType.id
        },
        {
          details: 'Filter Clogging',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: hydraulicMachineType.id
        },
        {
          details: 'Electrical Circuit Failure',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: hydraulicMachineType.id
        },
        {
          details: 'Sensor Failure',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: hydraulicMachineType.id
        },
        {
          details: 'Mold Damage',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: hydraulicMachineType.id
        },
        {
          details: 'Die Sticking',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: hydraulicMachineType.id
        },
        {
          details: 'Lubrication System Failure',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: cuttingMachineType.id
        },
        {
          details: 'Worn Bearings',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: cuttingMachineType.id
        },
        {
          details: 'Damaged Shaft or Gears',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: cuttingMachineType.id
        },
        {
          details: 'Damaged Shaft or Gears',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: cuttingMachineType.id
        },
        {
          details: 'Electrical Circuit Failure',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: cuttingMachineType.id
        },
        {
          details: 'Sensor Failure',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: cuttingMachineType.id
        },
        {
          details: 'Faulty Switch',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: cuttingMachineType.id
        },
        {
          details: 'Mold Damage',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: cuttingMachineType.id
        },
        {
          details: 'Incorrect Mold Setup',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: cuttingMachineType.id
        },
        {
          details: 'Faulty Clamping Mechanism',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: weldingMachineType.id
        },
        {
          details: 'Irregular Movement of Mechanical Parts',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: weldingMachineType.id
        },
        {
          details: 'Cooling System Failure',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: weldingMachineType.id
        },
        {
          details: 'Unstable Power Supply',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: weldingMachineType.id
        },
        {
          details: 'Electrical Short Circuit',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: weldingMachineType.id
        },
        {
          details: 'Blown Fuse',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: weldingMachineType.id
        },
        {
          details: 'Inverter Malfunction',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: weldingMachineType.id
        },
        {
          details: 'Damaged Fixture or Jig',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: weldingMachineType.id
        },
        {
          details: 'Incorrect Workpiece Positioning in Fixture',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: weldingMachineType.id
        },
        {
          details: 'Material Conveyor System Failure',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: annealingMachineType.id
        },
        {
          details: 'Damaged Internal Furnace Components',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: annealingMachineType.id
        },
        {
          details: 'Burner Failure',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: annealingMachineType.id
        },
        {
          details: 'Temperature Control System Failure',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: annealingMachineType.id
        },
        {
          details: 'Relay Malfunction',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: annealingMachineType.id
        },
        {
          details: 'Electrical Short Circuit',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: annealingMachineType.id
        },
        {
          details: 'Worn Mold Components',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: annealingMachineType.id
        },
        {
          details: 'Clogged or Damaged Nozzle',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: sandBlastingMachineType.id
        },
        {
          details: 'Insufficient Pressure',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: sandBlastingMachineType.id
        },
        {
          details: 'Dust Filtration System Malfunction',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: sandBlastingMachineType.id
        },
        {
          details: 'Electric Motor Failure',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: sandBlastingMachineType.id
        },
        {
          details: 'Faulty Electrical Control Panel',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: sandBlastingMachineType.id
        },
        {
          details: 'Mold Damaged by Blasting',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: sandBlastingMachineType.id
        },
        {
          details: 'Dust Filtration System Malfunction',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: sandBlastingMachineType.id
        },
        {
          details: 'Clogged or Damaged Zinc Spray Nozzle',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: zincMetalizingMachineType.id
        },
        {
          details: 'Material Conveyance System Failure',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: zincMetalizingMachineType.id
        },
        {
          details: 'Inconsistent Air Pressure',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: zincMetalizingMachineType.id
        },
        {
          details: 'Electric Motor Failure',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: zincMetalizingMachineType.id
        },
        {
          details: 'Faulty Sensors',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: zincMetalizingMachineType.id
        },
        {
          details: 'Mold or Fixture Mismatch with Workpiece',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: zincMetalizingMachineType.id
        },
        {
          details: 'Incorrect Workpiece Positioning',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: zincMetalizingMachineType.id
        },
        {
          details: 'Clogged Paint Gun or Nozzle',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: paintingMachineType.id
        },
        {
          details: 'Reciprocator Movement Failure',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: paintingMachineType.id
        },
        {
          details: 'Air Pressure Inconsistencies for Spray System',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: paintingMachineType.id
        },
        {
          details: 'Conveyor System Malfunction',
          typeOfFailureId: mechanicalFailure.id,
          machineTypeId: paintingMachineType.id
        },
        {
          details: 'Electric Motor Failure',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: paintingMachineType.id
        },
        {
          details: 'Faulty Motion Sensors',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: paintingMachineType.id
        },
        {
          details: 'PLC Control System Failure',
          typeOfFailureId: electricalFailure.id,
          machineTypeId: paintingMachineType.id
        },
        {
          details: 'Paint Build-up on Molds or Fixtures',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: paintingMachineType.id
        },
        {
          details: 'Improper Cleaning or Maintenance of Molds',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: paintingMachineType.id
        },
        {
          details: 'Damaged or Worn Tooling',
          typeOfFailureId: toolingFailure.id,
          machineTypeId: paintingMachineType.id
        },

      ]
    });
  
    console.log('Seeding complete!');
  }
  
  main()
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
  
    




    
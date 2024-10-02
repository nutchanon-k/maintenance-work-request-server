require('dotenv').config()


const prisma = require('../models/prisma')


async function run(params) {
    await prisma.$executeRawUnsafe("DROP DATABASE maintenance_work_request")
    await prisma.$executeRawUnsafe("CREATE DATABASE maintenance_work_request")
}

console.log("Reset DB...")
run()
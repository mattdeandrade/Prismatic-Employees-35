const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    res.json(employee);
  } catch (e) {
    return next({
      status: 404,
      message: `An employee with id:${id}} does not exist.`,
    });
  }
});

router.post("/", async (req, res, next) => {
  const { name } = req.body;
  try {
    const employee = await prisma.employee.create({ data: { name: name } });
    res.status(201).json(employee);
  } catch (e) {
    next({ status: 400, message: "Name not provided correctly." });
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const employee = await prisma.employee.findUnique({ where: { id: +id } });
    if (!employee)
      return next({
        status: 404,
        message: `An employee with id:${id} does not exist to update.`,
      });
    if (!name)
      return next({
        status: 400,
        message: "Name not provided correctly for update.",
      });
    const updatedEmployee = await prisma.employee.update({
      where: { id: +id },
      data: { name: name },
    });
    res.status(201).json(updatedEmployee);
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    await prisma.employee.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (e) {
    next({
      status: 404,
      message:
        "An employee was not deleted since a proper existing id was not provided.",
    });
  }
});

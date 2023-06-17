const Clinic = require("../models/clinicModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");

/////////////////////////////////////////////////////

module.exports = {
  createClinic: asyncHandler(async (req, res, next) => {
    const { name, description, governorate, street } = req.body;
    const clinic = new Clinic({
      name,
      description,
      location: { governorate, street },
    });
    await clinic.save();
    res.status(200).json({ data: clinic });
  }),
  //@desc     create Clinic
  //route     POST /api/v1/Clinics
  //access    private

  getClinics: Factory.getAll(Clinic, "Clinic", "manager", "name email phone"),
  //@desc     get list of Clinic
  //route     GET /api/v1/Clinics
  //access    public

  getClinic: Factory.getOnebyId(Clinic, "Clinic"),

  //@desc     get specific Clinic by id
  //route     GET /api/v1/Clinics/:id
  //access    public
  updateClinic: Factory.updateOnebyId(Clinic, "Clinic"),

  //@desc    update specific Clinic by id
  //route     PUT /api/v1/Clinics/:id
  //access    private

  deleteClinic: Factory.deleteOne(Clinic, "Clinic"),

  //@desc    delete specific product by id
  //route     DELETE /api/v1/products/:id
  //access    private

  addServices: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const clinic = await Clinic.findById(id);
    if (!clinic) {
      return res.status(400).json({ message: "clinic not found" });
    }
    clinic.services.push({ name, description, price });
    await clinic.save();
    res.status(200).json({ data: clinic });
  }),
  getServices: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const clinic = await Clinic.findById(id);
    if (!clinic) {
      return res.status(400).json({ message: "clinic not found" });
    }
    res.status(200).json({ data: clinic.services });
  }),
  deleteService: asyncHandler(async (req, res, next) => {
    const { clinicId, serviceId } = req.params;
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "clinic not found" });
    }
    const service = clinic.services.id(serviceId);
    if (!service) {
      return res.status(400).json({ message: "offer not found" });
    }
    service.remove();
    await clinic.save();
    res.status(200).json({ data: clinic });
  }),
  updateService: asyncHandler(async (req, res, next) => {
    const { clinicId, serviceId } = req.params;
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "clinic not found" });
    }
    const service = clinic.services.id(serviceId);
    if (!service) {
      return res.status(400).json({ message: "service not found" });
    }
    service.set(req.body);
    await clinic.save();
    res.status(200).json({ data: clinic });
  }),
  getService: asyncHandler(async (req, res, next) => {
    const { clinicId, serviceId } = req.params;
    const clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "clinic not found" });
    }
    const service = clinic.services.id(serviceId);
    if (!service) {
      return res.status(400).json({ message: "service not found" });
    }
    res.status(200).json({ data: service });
  }),
};

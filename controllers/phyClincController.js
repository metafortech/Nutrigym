const PhyClinc = require("../models/phyiscalclinicModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");

/////////////////////////////////////////////////////

module.exports = {
  createClinc: asyncHandler(async (req, res, next) => {
    const { name, description, governorate, street } = req.body;
    const clinic = new PhyClinc({
      name,
      description,
      location: { governorate, street },
    });
    await clinic.save();
    res.status(200).json({ data: clinic });
  }),
  //@desc     create Clinc
  //route     POST /api/v1/Clincs
  //access    private

  getClincs: Factory.getAll(
    PhyClinc,
    "PhyClinc",
    "manager",
    "name email phone"
  ),
  //@desc     get list of Clinc
  //route     GET /api/v1/Clincs
  //access    public

  getClinc: Factory.getOnebyId(PhyClinc, "PhyClinc"),

  //@desc     get specific Clinc by id
  //route     GET /api/v1/Clincs/:id
  //access    public
  updateClinc: Factory.updateOnebyId(PhyClinc, "PhyClinc"),

  //@desc    update specific Clinc by id
  //route     PUT /api/v1/Clincs/:id
  //access    private

  deleteClinc: Factory.deleteOne(PhyClinc, "PhyClinc"),

  //@desc    delete specific product by id
  //route     DELETE /api/v1/products/:id
  //access    private

  addServices: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const phyclinc = await PhyClinc.findById(id);
    if (!phyclinc) {
      return res.status(400).json({ message: "PhyClinc not found" });
    }
    phyclinc.services.push({ name, description, price });
    await phyclinc.save();
    res.status(200).json({ data: phyclinc });
  }),
  getServices: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const clinic = await PhyClinc.findById(id);
    if (!clinic) {
      return res.status(400).json({ message: "PhyClinc not found" });
    }
    res.status(200).json({ data: clinic.services });
  }),
  deleteService: asyncHandler(async (req, res, next) => {
    const { clinicId, serviceId } = req.params;
    const clinic = await PhyClinc.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "PhyClinc not found" });
    }
    const service = PhyClinc.services.id(serviceId);
    if (!service) {
      return res.status(400).json({ message: "service not found" });
    }
    service.remove();
    await clinic.save();
    res.status(200).json({ data: clinic });
  }),
  updateService: asyncHandler(async (req, res, next) => {
    const { clinicId, serviceId } = req.params;
    const clinic = await PhyClinc.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "PhyClinc not found" });
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
    const clinic = await PhyClinc.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "PhyClinc not found" });
    }
    const service = clinic.services.id(serviceId);
    if (!service) {
      return res.status(400).json({ message: "service not found" });
    }
    res.status(200).json({ data: service });
  }),
};

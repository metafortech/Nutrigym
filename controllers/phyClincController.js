const phyClinc = require("../models/phyiscalclinicModel");
const Factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");

/////////////////////////////////////////////////////

module.exports = {
  createClinc: Factory.createOne(phyClinc),
  //@desc     create Clinc
  //route     POST /api/v1/Clincs
  //access    private

  getClincs: Factory.getAll(phyClinc, "phyClinc"),
  //@desc     get list of Clinc
  //route     GET /api/v1/Clincs
  //access    public

  getClinc: Factory.getOnebyId(phyClinc, "phyClinc", "reviews"),

  //@desc     get specific Clinc by id
  //route     GET /api/v1/Clincs/:id
  //access    public
  updateClinc: Factory.updateOnebyId(phyClinc, "phyClinc"),

  //@desc    update specific Clinc by id
  //route     PUT /api/v1/Clincs/:id
  //access    private

  deleteClinc: Factory.deleteOne(phyClinc, "phyClinc"),

  //@desc    delete specific product by id
  //route     DELETE /api/v1/products/:id
  //access    private

  addServices: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const phyclinc = await phyClinc.findById(id);
    if (!phyclinc) {
      return res.status(400).json({ message: "phyClinc not found" });
    }
    phyClinc.services.push({ name, description, price });
    await phyClinc.save();
    res.status(200).json({ data: phyClinc });
  }),
  getServices: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const clinic = await phyClinc.findById(id);
    if (!clinic) {
      return res.status(400).json({ message: "phyClinc not found" });
    }
    res.status(200).json({ data: clinic.services });
  }),
  deleteService: asyncHandler(async (req, res, next) => {
    const { clinicId, serviceId } = req.params;
    const clinic = await phyClinc.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "phyClinc not found" });
    }
    const service = phyClinc.services.id(serviceId);
    if (!service) {
      return res.status(400).json({ message: "service not found" });
    }
    service.remove();
    await clinic.save();
    res.status(200).json({ data: clinic });
  }),
  updateService: asyncHandler(async (req, res, next) => {
    const { clinicId, serviceId } = req.params;
    const clinic = await phyClinc.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "phyClinc not found" });
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
    const clinic = await phyClinc.findById(clinicId);
    if (!clinic) {
      return res.status(400).json({ message: "phyClinc not found" });
    }
    const service = clinic.services.id(serviceId);
    if (!service) {
      return res.status(400).json({ message: "service not found" });
    }
    res.status(200).json({ data: service });
  }),
};

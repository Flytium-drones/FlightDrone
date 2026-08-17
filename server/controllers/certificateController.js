import Certificate from "../models/Certificate.js";

// Create a new certificate
export const createCertificateController = async (req, res) => {
  try {
    const { certificateId, pdfUrl } = req.body;

    // Validation
    if (!certificateId || !pdfUrl) {
      return res.status(400).send({
        success: false,
        message: "Certificate ID and PDF are required",
      });
    }

    // Check if certificateId already exists
    const existingCertificate = await Certificate.findOne({ certificateId });
    if (existingCertificate) {
      return res.status(400).send({
        success: false,
        message: "Certificate ID already exists",
      });
    }

    const certificate = await new Certificate({
      certificateId,
      pdfUrl,
    }).save();

    res.status(201).send({
      success: true,
      message: "Certificate created successfully",
      certificate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating certificate",
      error,
    });
  }
};

// Get all certificates
export const getAllCertificatesController = async (req, res) => {
  try {
    const certificates = await Certificate.find({}).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All certificates fetched successfully",
      certificates,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting certificates",
      error,
    });
  }
};

// Delete a certificate
export const deleteCertificateController = async (req, res) => {
  try {
    const { id } = req.params;
    await Certificate.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting certificate",
      error,
    });
  }
};

// Verify a certificate
export const verifyCertificateController = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({ certificateId });
    if (!certificate) {
      return res.status(404).send({
        success: false,
        message: "Certificate not found. Invalid Certificate ID.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Certificate verified successfully",
      certificate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while verifying certificate",
      error,
    });
  }
};

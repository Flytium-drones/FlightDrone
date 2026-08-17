import Certificate from "../models/Certificate.js";

// Create a new certificate
export const createCertificateController = async (req, res) => {
  try {
    const { certificateId, studentName, courseName, issueDate, pdfUrl } = req.body;

    // Validation
    if (!certificateId || !studentName || !courseName || !issueDate || !pdfUrl) {
      return res.status(400).send({
        success: false,
        message: "All required fields must be provided, including PDF",
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
      studentName,
      courseName,
      issueDate,
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
    const { certificateId } = req.params; // Using this as the search query

    const certificates = await Certificate.find({
      $or: [
        { certificateId: { $regex: new RegExp(`^${certificateId}$`, "i") } },
        { studentName: { $regex: new RegExp(certificateId, "i") } }
      ]
    });

    if (!certificates || certificates.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No certificates found with this Name or ID.",
      });
    }

    res.status(200).send({
      success: true,
      message: "Certificate verified successfully",
      certificates, // Now returning an array
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

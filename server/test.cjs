const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sunilprajapati1326:o74r3NIF72mH0L0o@cluster0.zexoln1.mongodb.net/flytiumdrone?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(async () => {
  const schema = new mongoose.Schema({ certificateId: String, studentName: String });
  const Cert = mongoose.model('Certificate', schema, 'certificates');
  const docs = await Cert.find({ studentName: /Anurag/i });
  console.log(docs);
  process.exit(0);
});

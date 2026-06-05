import "../../styles/admin/certificate.css";

function CertificateDetails({ cert }) {
  if (!cert) {
    return <div className="details">Select a certificate to view details.</div>;
  }

  // Build certificate file URL
  const fileUrl = cert.fileName
    ? `${
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
      }/uploads/${cert.fileName}`
    : null;

  // Format upload date
  const uploadedDate = cert.uploadedAt
    ? new Date(cert.uploadedAt).toLocaleString()
    : "Unknown";

  return (
    <div className="details">
      {/* Certificate title */}
      <h2>📄 {cert.certificateName}</h2>

      {/* Blockchain hash */}
      <p>
        <strong>Hash:</strong>
      </p>

      <p className="hash">{cert.certificateHash}</p>

      {/* Upload information */}
      <p>
        <strong>Uploaded At:</strong>
      </p>

      <p>{uploadedDate}</p>

      {/* Certificate preview */}
      {fileUrl ? (
        <>
          <h3>Preview</h3>

          <iframe
            src={fileUrl}
            title="Certificate Preview"
            width="100%"
            height="500"
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />

          <br />
          <br />

          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="download-btn"
          >
            ⬇ View / Download Certificate
          </a>
        </>
      ) : (
        <p
          style={{
            color: "orange",
          }}
        >
          ⚠ This certificate has no file attached.
        </p>
      )}
    </div>
  );
}

export default CertificateDetails;

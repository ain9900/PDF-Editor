import React, { useEffect, useState } from "react";
import PSPDFKit from "pspdfkit";

const PdfEditor = () => {
  const [pdfFile, setPdfFile] = useState(null); // State for storing the uploaded PDF file

  useEffect(() => {
    const baseUrl = `${window.location.origin}/assets/`;

    if (pdfFile) {
      // Initialize PSPDFKit with the selected PDF
      PSPDFKit.load({
        baseUrl,
        container: "#pspdfkit",
        document: pdfFile, // Use the selected PDF file
      })
        .then((instance) => {
          console.log("PSPDFKit loaded", instance);

          // Save the instance for later use
          window.pdfEditorInstance = instance;
        })
        .catch((error) => {
          console.error("Failed to load PSPDFKit", error);
        });

      // Cleanup PSPDFKit on component unmount or when PDF changes
      return () => PSPDFKit.unload("#pspdfkit");
    }
  }, [pdfFile]); // Re-run effect when pdfFile changes

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // Read the file as an ArrayBuffer to pass it to PSPDFKit
      reader.onload = (e) => {
        setPdfFile(e.target.result); // Set the loaded PDF file to state
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const savePdf = async () => {
    if (window.pdfEditorInstance) {
      const pdfData = await window.pdfEditorInstance.exportPDF();
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Trigger file download
      const a = document.createElement("a");
      a.href = url;
      a.download = "edited-document.pdf";
      a.click();

      URL.revokeObjectURL(url);
    } else {
      alert("No PDF loaded to save!");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          style={{ marginBottom: "10px" }}
        />
        <button onClick={savePdf} disabled={!pdfFile}>
          Save Edited PDF
        </button>
      </div>
      <div
        id="pspdfkit"
        style={{
          width: "100%",
          height: "90vh",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
};

export default PdfEditor;

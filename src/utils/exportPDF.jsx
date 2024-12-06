import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from 'html2canvas';
import { add } from "lodash";

// reusable header and footer for PDF
const addHeader = (doc) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("WONG & LOH Advocates and Solicitors", 14, 15); // Firm Name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
        "C-6-6 Plaza Mont’ Kiara, No.2, Jalan Kiara, Mont’ Kiara, 50480 Kuala Lumpur.",
        14, 20 // Firm's Address
    );
    doc.text("Tel: +603-6419 5989 | Fax: +603-6419 5987 | Email: wl_kl@wongloh.com", 14, 25);
    // Add a line separator under the header (increased Y for spacing)
    doc.setLineWidth(0.5);
    doc.line(14, 30, 195, 30); // Horizontal line for separation
};

const addFooter = (doc) => {
    // Footer - Firm Contact Info (on every page except the first)
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    // Add footer line at the bottom
    doc.setLineWidth(0.5);
    doc.line(14, doc.internal.pageSize.height - 30, 195, doc.internal.pageSize.height - 30); // 

    // Add Firm's Contact Info
    doc.text(
        "WONG & LOH Advocates and Solicitors | Tel: +603-6419 5989 | Fax: +603-6419 5987 | Email: wl_kl@wongloh.com",
        14, doc.internal.pageSize.height - 20
    );
    // Add page number
    doc.text(`Page ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 20);
};


const exportPDF = (caseItem) => {
    const doc = new jsPDF();

    // Header - Firm's Info (on the first page only)
    addHeader(doc);

    // Title - Case Details
    // doc.setFontSize(14);
    // doc.setFont("helvetica", "bold");
    // doc.text("test", 14, 40); // Adjusted Y-coordinate for spacing after the line

    // Define Table Rows for Top and Bottom Tables
    const topTableRows = [];
    const bottomTableRows = [];

    caseItem.fields.forEach((field) => {
        const mainInfo = field.type === "date"
            ? new Date(field.value).toLocaleDateString()
            : field.type === "price"
                ? `RM ${field.value}`
                : field.value;

        // Prepare Additional Info
        let additionalInfo = "";

        if (field.type === "stakeholder") {
            const details = [];
            if (field.tel) details.push(`Phone: ${field.tel}`);
            if (field.email) details.push(`Email: ${field.email}`);
            if (field.fax) details.push(`Fax: ${field.fax}`);
            additionalInfo = details.join("\n");
        } else if (field.remarks && field.remarks.trim() !== "") {  // Check if remarks exist and are not just whitespace
            additionalInfo = `Remarks: ${field.remarks}`;
        }

        const row = [
            { content: field.name, styles: { halign: "left", fontStyle: "bold" } }, // Title
            { content: mainInfo }, // Main Info
            { content: additionalInfo || "-", styles: { fontStyle: "italic" } }, // Additional Info
        ];

        // Add rows to respective tables
        if (["text", "number", "stakeholder"].includes(field.type)) {
            topTableRows.push(row);
        } else if (["price", "date"].includes(field.type)) {
            bottomTableRows.push(row);
        }
    });

    // Generate Top Table
    doc.autoTable({
        head: [["Title", "Description", "Remarks"]],
        body: topTableRows,
        startY: 40, // Increased spacing for clarity
        styles: { fontSize: 10 },
        columnStyles: {
            0: { cellWidth: 50 }, // Title Column
            1: { cellWidth: 70 }, // Description Column
            2: { cellWidth: 58 }, // Additional Info Column
        },
    });

    // Generate Bottom Table
    const nextTableStartY = doc.lastAutoTable.finalY + 10; // Add spacing between tables
    doc.autoTable({
        head: [["Title", "Amount (RM) / Date", "Remarks"]],
        body: bottomTableRows,
        startY: nextTableStartY,
        styles: { fontSize: 10 },
        columnStyles: {
            0: { cellWidth: 50 }, // Title Column
            1: { cellWidth: 70 }, // Description Column
            2: { cellWidth: 58 }, // Additional Info Column
        },
    });

    // Add Final Row for 'File Closed'
    const fileClosedRow = [
        { content: "File Closed", styles: { halign: "left", fontStyle: "bold" } }, // Title
        {
            content: `Confirmed by solicitor in charge: \n\n\n\n.......................................... \n(Signature)`,
            styles: { fontStyle: "italic", cellWidth: 70 },
        }, // Description with signature placeholder
        { content: "", styles: { fontStyle: "italic", cellWidth: 60 } }, // Empty for Additional Info
    ];

    // Add 'File Closed' row to bottom table
    doc.autoTable({
        body: [fileClosedRow],
        startY: doc.lastAutoTable.finalY + 5, // Add spacing after last row
        styles: { fontSize: 10 },
        columnStyles: {
            0: { cellWidth: 50 }, // Title Column
            1: { cellWidth: 70 }, // Description Column
            2: { cellWidth: 60 }, // Additional Info Column
        },
        showHead: false, // No need to repeat headers for this final row
    });
    // Add footer
    addFooter(doc);

    // Save PDF
    doc.save(`Case - ${caseItem.matterName}.pdf`);
};

const exportAnalysis = async (caseAnalysis) => {
    const doc = new jsPDF();

    // Header
    addHeader(doc);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text('Analysis Report', 14, 40);
    //Export date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const date = new Date().toLocaleDateString();
    const dateWidth = doc.getTextWidth(`Exported on: ${date}`);
    const pageWidth = doc.internal.pageSize.width;
    const xRightToLeft = pageWidth - dateWidth - 14;
    doc.text(`Exported on: ${date}`, xRightToLeft, 40);

    // Add Key Metrics
    doc.setFontSize(12);
    const metrics = [
        `Active Cases: ${caseAnalysis.activeCases}`,
        `Cases This Month: ${caseAnalysis.casesThisMonth}`,
        `Cases Closed This Month: ${caseAnalysis.casesClosedThisMonth}`,
        `Tasks Completed This Month: ${caseAnalysis.tasksCompletedThisMonth}`,
    ];
    metrics.forEach((metric, index) => {
        doc.text(metric, 14, 50 + index * 10);
    });

    // Convert a chart or section to an image
    const chartElement = document.querySelector('#chartContainer'); // Replace with your chart container ID
    if (chartElement) {
        const canvas = await html2canvas(chartElement, {
            ignoreElements: (element) => element.classList.contains('exclude'),
        });

        const imgData = canvas.toDataURL('image/png');

        // Get original dimensions
        const imgWidth = 180; // Desired width in PDF
        const imgHeight = (canvas.height / canvas.width) * imgWidth; // Maintain aspect ratio

        doc.addImage(imgData, 'PNG', 14, 90, imgWidth, imgHeight);
    }

    // Add footer
    addFooter(doc);

    // Save PDF
    doc.save('CaseAnalysisReport.pdf');
}


export { exportPDF, exportAnalysis };
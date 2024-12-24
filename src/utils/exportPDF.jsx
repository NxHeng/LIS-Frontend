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

    caseItem?.fields.forEach((field) => {
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
    doc.save(`Case - ${caseItem?.matterName}.pdf`);
};

const exportAnalysis = async (monthlyStatus, yearlyStatus, month, year, category, homeView) => {
    const doc = new jsPDF();

    // Map the month number to its name
    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    const type = homeView === "monthly" ? "Monthly" : "Yearly";
    const postfix = homeView === "monthly" ? `(${months[month - 1]}, ${year})` : `${year}`;

    // Header
    addHeader(doc);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`${type} Analysis Report ${postfix}`, 14, 40);

    // Export date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const date = new Date().toLocaleDateString();
    const dateWidth = doc.getTextWidth(`Exported on: ${date}`);
    const pageWidth = doc.internal.pageSize.width;
    const xRightToLeft = pageWidth - dateWidth - 14;
    doc.text(`Exported on: ${date}`, xRightToLeft, 40);

    // Add category text
    doc.setFontSize(12);
    doc.text(`Category: ${category}`, 14, 48);

    // Add Key Metrics
    doc.setFontSize(12);
    let metrics = [];
    if (homeView === "monthly") {
        metrics = [
            `Cases Initiated: ${monthlyStatus.kpis.casesInitiatedCurrentMonth}`,
        ];
        metrics.forEach((metric, index) => {
            doc.text(metric, 14, 55 + index * 10);
        });
    }
    else {
        metrics = [
            `Cases Initiated: ${yearlyStatus.kpis.casesInitiatedCurrentYear}`,
        ];
        metrics.forEach((metric, index) => {
            doc.text(metric, 14, 55 + index * 10);
        });
    }

    // Select each chart element individually
    let charts = [];
    if (homeView === "monthly") {
        charts = document.querySelectorAll('.chart.month');
    } else {
        charts = document.querySelectorAll('.chart.year');
    }

    // Chart layout settings
    const margin = 7; // Margin from the edge of the page
    const padding = 1; // Padding around each chart
    const chartWidth = (pageWidth - margin * 3) / 2 - padding * 2; // Two charts side by side with padding
    let currentX = margin;
    let currentY = 60; // Starting Y position for charts
    const chartSpacing = 10; // Spacing between rows of charts
    const pageHeight = doc.internal.pageSize.height;

    // Loop through each chart and add to the PDF
    for (const chart of charts) {
        // Use html2canvas to capture the chart as an image
        const canvas = await html2canvas(chart, {
            ignoreElements: (element) => element.classList.contains('exclude'),
            scale: 2,  // Increase resolution if needed
        });
    
        // Check if canvas was rendered successfully
        if (!canvas) {
            console.error("html2canvas failed to render the chart.");
            continue;
        }
    
        const imgData = canvas.toDataURL('image/png');
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
        const aspectRatio = originalHeight / originalWidth;
    
        // Define the desired width for the chart (70% of the page width)
        const chartWidth = pageWidth * 0.7;
        const imgHeight = chartWidth * aspectRatio;
    
        // Center the chart on the page
        const centerX = (pageWidth - chartWidth) / 2;
    
        // Ensure the chart fits within the page; if not, add a new page
        if (currentY + imgHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin + 10; // Reset Y position
        }
    
        // Add the chart image to the PDF
        doc.addImage(imgData, 'PNG', centerX, currentY, chartWidth, imgHeight);
    
        // Optional: Add border around the chart
        doc.setDrawColor(0); // Black color for the border
        doc.setLineWidth(0.3); // Border thickness
        doc.rect(centerX, currentY, chartWidth, imgHeight); // Draw border rectangle
    
        // Update position for the next chart
        currentY += imgHeight + chartSpacing;
    }
    

    {
        let status = homeView === "monthly" ? monthlyStatus : yearlyStatus;
        // Add a page break before the table
        doc.addPage();

        // Add header for the table
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Cases by Staffs", 14, 20);

        // Add table headers and data (Example for table with monthlyStatus.table data)
        const headers = [
            'Staff Name',
            'Cases Handled',
            'Cases by Category',
            'Avg Turnaround Time (Days)',
        ];

        const rows = status.table.map(staff => [
            staff.staffName,
            staff.casesHandled,
            staff.categories.map(category => `${category.categoryName}: ${category.count}`).join(", "),  // Joining categories in a single string
            Math.round((staff.avgTurnaroundTime / (1000 * 60 * 60 * 24)) * 10) / 10,  // Convert ms to days
        ]);

        const startY = 35; // Starting position of the table
        const rowHeight = 5;
        const columnWidths = [40, 35, 50, 48];  // Adjust column widths according to your needs
        const maxWidth = pageWidth - 20;  // Account for margins

        // Add table header to the PDF
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        headers.forEach((header, index) => {
            doc.text(header, 14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), startY);
        });

        // add a line separator under the header
        doc.setLineWidth(0.5);
        doc.line(14, startY + 2, 14 + columnWidths.reduce((a, b) => a + b, 0), startY + 2);

        // Add table rows
        doc.setFont("helvetica", "normal");
        let currentY = startY + rowHeight + 2;
        rows.forEach((row, rowIndex) => {
            let categoryY = currentY; // Track the Y position for the "Cases by Category" column
        
            // Iterate over the columns
            row.forEach((cell, index) => {
                let columnX = 14 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
        
                if (index === 2) { // "Cases by Category" column
                    const categories = String(cell).split(',').map(item => item.trim());  // Split and trim spaces
                    const lineHeight = 6;  // Line height for wrapped text
        
                    // Loop through each category and add to the PDF
                    categories.forEach((category) => {
                        // Split each category into multiple lines if it exceeds the column width
                        const wrappedText = doc.splitTextToSize(category, columnWidths[index]);
                        doc.text(wrappedText, columnX, categoryY);
                        categoryY += wrappedText.length * lineHeight;  // Increase the Y position for each line
                    });
                } else { // Other columns (e.g., "Staff Name", "Cases Handled", "Avg Turnaround Time")
                    doc.text(String(cell), columnX, currentY);
                }
            });
        
            // Determine the bottom Y position for the row (categoryY handles wrapped text cases)
            const rowBottomY = Math.max(currentY, categoryY) - 3;
        
            // Check if this is the last row for the current staff
            const isLastRowForStaff =
                rowIndex === rows.length - 1 || // Last row in the table
                rows[rowIndex][0] !== rows[rowIndex + 1][0]; // Staff name changes in the next row
        
            if (isLastRowForStaff) {
                // Draw a bottom line for the current staff's entry
                const totalWidth = columnWidths.reduce((a, b) => a + b, 0);
                doc.line(14, rowBottomY, 14 + totalWidth, rowBottomY);
            }
        
            // Update currentY for the next row
            currentY = rowBottomY + rowHeight;
        
            // If the current row exceeds the page height, add a new page
            if (currentY > pageHeight - 20) {
                doc.addPage(); // Add a new page
                currentY = 20; // Reset Y position for new page
            }
        });
        
    }

    // Add footer
    addFooter(doc);

    // Save the generated PDF
    doc.save(`${type} Report-${postfix}.pdf`);
};


export { exportPDF, exportAnalysis };
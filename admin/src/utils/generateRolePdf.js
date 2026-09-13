import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateRolePdf({ role, data }) {
  const pdfDoc = await PDFDocument.create();
  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const roleTitleMap = {
    secretary: 'Event Secretary Details Report',
    convenor: 'Event Convenor Details Report',
    volunteer: 'Event Volunteer Details Report',
  };

  const title = roleTitleMap[String(role).toLowerCase()] || 'Role Details Report';
  const roleNameLabel = String(role).toLowerCase() === 'convenor' 
    ? 'Convenor Name' 
    : String(role).toLowerCase() === 'volunteer' 
    ? 'Volunteer Name' 
    : 'Secretary Name';

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB');
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase();
  const timestampText = `Generated on ${dateStr}, ${timeStr}`;

  // Page layout dimensions (Landscape or Portrait - attached screenshot is Landscape A4)
  // Page size: A4 Landscape width = 841.89, height = 595.28
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin - 20;

  const drawPageBorderAndHeader = (page) => {
    // Outer border around page content
    page.drawRectangle({
      x: margin,
      y: margin,
      width: contentWidth,
      height: pageHeight - margin * 2,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1.5,
    });

    // Report Title (Centered, Bold)
    const titleWidth = fontBold.widthOfTextAtSize(title, 18);
    page.drawText(title, {
      x: (pageWidth - titleWidth) / 2,
      y: pageHeight - margin - 30,
      size: 18,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // Subtitle Timestamp (Centered, Italic)
    const subWidth = fontItalic.widthOfTextAtSize(timestampText, 10);
    page.drawText(timestampText, {
      x: (pageWidth - subWidth) / 2,
      y: pageHeight - margin - 46,
      size: 10,
      font: fontItalic,
      color: rgb(0, 0, 0),
    });
  };

  drawPageBorderAndHeader(currentPage);
  y = pageHeight - margin - 70;

  // Group data by Association if array of items or array of associations
  let associationsMap = {};

  if (Array.isArray(data)) {
    data.forEach((item) => {
      const clubName = item.associationName || item.club_name || item.clubName || item.association || 'Association';
      if (!associationsMap[clubName]) associationsMap[clubName] = [];
      
      const members = item.members || item.secretaries || item.volunteers || item.convenors || [item];
      members.forEach((m) => {
        associationsMap[clubName].push({
          name: m.name || m.secretaryName || m.convenorName || m.volunteerName || '—',
          rollNo: m.rollNo || m.rollNumber || m.roll_no || m.roll_number || '—',
          year: m.year || '4TH YEAR',
          department: m.department || m.dept || '—',
          phone: m.phone || m.phoneNo || m.phone_no || m.mobile || '—',
        });
      });
    });
  } else if (data && typeof data === 'object') {
    associationsMap = data;
  }

  // If map is empty, create sample/dummy empty state so PDF is generated cleanly
  const assocEntries = Object.entries(associationsMap);
  if (assocEntries.length === 0) {
    assocEntries.push([
      'General Association',
      [
        { name: 'NIL', rollNo: 'NIL', year: '4TH YEAR', department: 'NIL', phone: '0000000000' }
      ]
    ]);
  }

  const colWidths = [50, 210, 110, 100, 190, 121.89]; // Total = 781.89 = contentWidth (841.89 - 60)
  const headers = ['S.No', roleNameLabel, 'Roll Number', 'Year', 'Department', 'Phone No'];

  for (const [assocName, members] of assocEntries) {
    const tableHeaderHeight = 24;
    const rowHeight = 24;
    const bannerHeight = 24;
    const blockHeight = bannerHeight + tableHeaderHeight + members.length * rowHeight + 20;

    // Check page overflow
    if (y - blockHeight < margin + 15) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      drawPageBorderAndHeader(currentPage);
      y = pageHeight - margin - 70;
    }

    const tableX = margin + 5;
    const tableWidth = contentWidth - 10;

    // 1. Association Banner Header (#1F4E79 - Dark Navy Blue)
    currentPage.drawRectangle({
      x: tableX,
      y: y - bannerHeight,
      width: tableWidth,
      height: bannerHeight,
      color: rgb(0.12, 0.31, 0.47), // #1F4E79
    });

    currentPage.drawText(assocName, {
      x: tableX + 10,
      y: y - bannerHeight + 7,
      size: 11,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    y -= bannerHeight;

    // 2. Table Column Header (#D9E1F2 - Light Ice Blue)
    currentPage.drawRectangle({
      x: tableX,
      y: y - tableHeaderHeight,
      width: tableWidth,
      height: tableHeaderHeight,
      color: rgb(0.85, 0.88, 0.95), // #D9E1F2
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    let currentX = tableX;
    headers.forEach((h, i) => {
      const w = colWidths[i];
      const textWidth = fontBold.widthOfTextAtSize(h, 10);
      const isCentered = i === 0 || i === 2 || i === 3;
      const textX = isCentered ? currentX + (w - textWidth) / 2 : currentX + 10;

      currentPage.drawText(h, {
        x: textX,
        y: y - tableHeaderHeight + 7,
        size: 10,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      // Draw vertical border
      currentPage.drawLine({
        start: { x: currentX, y: y },
        end: { x: currentX, y: y - tableHeaderHeight },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      currentX += w;
    });

    // Rightmost border of header
    currentPage.drawLine({
      start: { x: currentX, y: y },
      end: { x: currentX, y: y - tableHeaderHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    y -= tableHeaderHeight;

    // 3. Member Rows
    members.forEach((m, idx) => {
      currentPage.drawRectangle({
        x: tableX,
        y: y - rowHeight,
        width: tableWidth,
        height: rowHeight,
        color: rgb(1, 1, 1),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      const rowValues = [
        String(idx + 1),
        String(m.name || '—'),
        String(m.rollNo || '—'),
        String(m.year || '—'),
        String(m.department || '—'),
        String(m.phone || '—'),
      ];

      let cellX = tableX;
      rowValues.forEach((val, i) => {
        const w = colWidths[i];
        const isCentered = i === 0 || i === 2 || i === 3;
        const valText = val.length > 28 ? val.substring(0, 26) + '…' : val;
        const valWidth = fontRegular.widthOfTextAtSize(valText, 9.5);
        const textX = isCentered ? cellX + (w - valWidth) / 2 : cellX + 10;

        currentPage.drawText(valText, {
          x: textX,
          y: y - rowHeight + 7,
          size: 9.5,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });

        currentPage.drawLine({
          start: { x: cellX, y: y },
          end: { x: cellX, y: y - rowHeight },
          thickness: 1,
          color: rgb(0, 0, 0),
        });

        cellX += w;
      });

      currentPage.drawLine({
        start: { x: cellX, y: y },
        end: { x: cellX, y: y - rowHeight },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      y -= rowHeight;
    });

    y -= 18; // Spacing after association block
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

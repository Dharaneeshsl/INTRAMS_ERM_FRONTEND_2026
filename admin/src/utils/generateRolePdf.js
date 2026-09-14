import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function wrapPdfText(text, font, size, maxWidth, maxLines = 2) {
  const raw = String(text ?? '—');
  const tokens = raw.trim() ? raw.split(/\s+/) : ['—'];
  const lines = [];
  let currentLine = '';

  const pushCurrentLine = () => {
    if (currentLine) {
      lines.push(currentLine);
      currentLine = '';
    }
  };

  const breakWord = (word) => {
    let part = '';
    for (const char of Array.from(word)) {
      const candidate = part + char;
      if (font.widthOfTextAtSize(candidate, size) > maxWidth && part) {
        lines.push(part);
        part = char;
      } else {
        part = candidate;
      }
    }
    if (part) {
      currentLine = part;
    }
  };

  for (const token of tokens) {
    const candidate = currentLine ? `${currentLine} ${token}` : token;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !currentLine) {
      currentLine = candidate;
    } else {
      pushCurrentLine();
      if (font.widthOfTextAtSize(token, size) <= maxWidth) {
        currentLine = token;
      } else {
        breakWord(token);
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  const compact = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    const last = compact[maxLines - 1];
    compact[maxLines - 1] = last.length > 2 ? `${last.slice(0, -2)}…` : '…';
  }

  return compact.length ? compact : ['—'];
}

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
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
  const timestampText = `Generated on ${dateStr}, ${timeStr}`;

  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);

  const drawPageBorderAndHeader = (page) => {
    page.drawRectangle({
      x: margin,
      y: margin,
      width: contentWidth,
      height: pageHeight - margin * 2,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1.5,
    });

    const titleWidth = fontBold.widthOfTextAtSize(title, 18);
    page.drawText(title, {
      x: (pageWidth - titleWidth) / 2,
      y: pageHeight - margin - 30,
      size: 18,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

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
  let y = pageHeight - margin - 65;

  let associationsMap = {};

  const normalizedData = Array.isArray(data)
    ? data
    : (Array.isArray(data?.data)
      ? data.data
      : (Array.isArray(data?.associations)
        ? data.associations
        : (Array.isArray(data?.members)
          ? data.members
          : (Array.isArray(data?.[String(role).toLowerCase()])
            ? data[String(role).toLowerCase()]
            : Object.keys(data || {}).flatMap((key) => {
                const value = data[key];
                if (Array.isArray(value)) return [{ associationName: key, members: value }];
                if (value && Array.isArray(value.members)) return [{ associationName: key, members: value.members }];
                return [];
              })))));

  if (Array.isArray(normalizedData)) {
    normalizedData.forEach((item) => {
      const clubName = item.associationName || item.club_name || item.clubName || item.association || item.name || 'General Association';
      if (!associationsMap[clubName]) associationsMap[clubName] = [];

      const memberList = Array.isArray(item.members)
        ? item.members
        : (Array.isArray(item.secretaries)
          ? item.secretaries
          : (Array.isArray(item.volunteers)
            ? item.volunteers
            : (Array.isArray(item.convenors)
              ? item.convenors
              : (Array.isArray(item[role])
                ? item[role]
                : [item]))));

      memberList.forEach((m) => {
        associationsMap[clubName].push({
          name: m.name || m.secretaryName || m.convenorName || m.volunteerName || '—',
          rollNo: m.rollNo || m.rollNumber || m.roll_no || m.roll_number || '—',
          year: m.year || m.yearOfStudy || m.studyYear || '4TH YEAR',
          department: m.department || m.dept || m.specialization || '—',
          phone: m.phone || m.phoneNo || m.phone_no || m.mobile || '—',
        });
      });
    });
  } else if (data && typeof data === 'object') {
    associationsMap = data;
  }

  const assocEntries = Object.entries(associationsMap);
  if (assocEntries.length === 0) {
    assocEntries.push([
      'General Association',
      [{ name: 'NIL', rollNo: 'NIL', year: '4TH YEAR', department: 'NIL', phone: '0000000000' }],
    ]);
  }

  const colWidths = [45, 200, 110, 85, 195, 146.89];
  const headers = ['S.No', roleNameLabel, 'Roll Number', 'Year', 'Department', 'Phone No'];

  const drawTableHeader = (page, currentY) => {
    const tableX = margin + 5;
    const tableWidth = contentWidth - 10;
    const tableHeaderHeight = 24;

    page.drawRectangle({
      x: tableX,
      y: currentY - tableHeaderHeight,
      width: tableWidth,
      height: tableHeaderHeight,
      color: rgb(0.85, 0.88, 0.95),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    let currentX = tableX;
    headers.forEach((h, i) => {
      const w = colWidths[i];
      const textWidth = fontBold.widthOfTextAtSize(h, 10);
      const isCentered = i === 0 || i === 2 || i === 3;
      const textX = isCentered ? currentX + (w - textWidth) / 2 : currentX + 10;

      page.drawText(h, {
        x: textX,
        y: currentY - tableHeaderHeight + 7,
        size: 10,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      page.drawLine({
        start: { x: currentX, y: currentY },
        end: { x: currentX, y: currentY - tableHeaderHeight },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      currentX += w;
    });

    page.drawLine({
      start: { x: currentX, y: currentY },
      end: { x: currentX, y: currentY - tableHeaderHeight },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    return currentY - tableHeaderHeight;
  };

  for (const [assocName, members] of assocEntries) {
    const bannerHeight = 26;
    const tableHeaderHeight = 26;
    const minRowHeight = 28;

    if (y - (bannerHeight + tableHeaderHeight + minRowHeight) < margin + 25) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      drawPageBorderAndHeader(currentPage);
      y = pageHeight - margin - 65;
    }

    const tableX = margin + 5;
    const tableWidth = contentWidth - 10;

    currentPage.drawRectangle({
      x: tableX,
      y: y - bannerHeight,
      width: tableWidth,
      height: bannerHeight,
      color: rgb(0.12, 0.31, 0.47),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1.2,
    });

    currentPage.drawText(assocName, {
      x: tableX + 10,
      y: y - bannerHeight + 8,
      size: 11,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    y -= bannerHeight;
    y = drawTableHeader(currentPage, y);

    members.forEach((m, idx) => {
      const rowValues = [
        String(idx + 1),
        String(m.name || '—'),
        String(m.rollNo || '—'),
        String(m.year || '—'),
        String(m.department || '—'),
        String(m.phone || '—'),
      ];

      const cellPadding = 6;
      const cellTextSize = 8.2;
      const lineHeight = 9;
      const maxLines = 2;
      const wrappedRows = rowValues.map((val, i) => {
        const w = colWidths[i];
        const availableWidth = Math.max(18, w - cellPadding * 2);
        const isCentered = i === 0 || i === 2 || i === 3;
        const inner = wrapPdfText(val, fontRegular, cellTextSize, availableWidth, maxLines);
        return { val, wrapped: inner, width: w, isCentered };
      });
      const rowHeight = Math.max(minRowHeight, 14 + Math.max(...wrappedRows.map((r) => r.wrapped.length)) * lineHeight);

      if (y - rowHeight < margin + 25) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        drawPageBorderAndHeader(currentPage);
        y = pageHeight - margin - 65;

        currentPage.drawRectangle({
          x: tableX,
          y: y - bannerHeight,
          width: tableWidth,
          height: bannerHeight,
          color: rgb(0.12, 0.31, 0.47),
          borderColor: rgb(0, 0, 0),
          borderWidth: 1.2,
        });

        currentPage.drawText(`${assocName} (Contd.)`, {
          x: tableX + 10,
          y: y - bannerHeight + 8,
          size: 11,
          font: fontBold,
          color: rgb(1, 1, 1),
        });

        y -= bannerHeight;
        y = drawTableHeader(currentPage, y);
      }

      const rowTop = y;
      currentPage.drawRectangle({
        x: tableX,
        y: rowTop - rowHeight,
        width: tableWidth,
        height: rowHeight,
        color: rgb(1, 1, 1),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      let cellX = tableX;
      wrappedRows.forEach((entry) => {
        const textLines = entry.wrapped;
        const contentHeight = textLines.length * lineHeight;
        const startY = rowTop - rowHeight + (rowHeight - contentHeight) / 2 + 7;

        textLines.forEach((line, lineIndex) => {
          const textWidth = fontRegular.widthOfTextAtSize(line, cellTextSize);
          const xPos = entry.isCentered ? cellX + (entry.width - textWidth) / 2 : cellX + cellPadding;
          const yPos = startY - lineIndex * lineHeight;

          currentPage.drawText(line, {
            x: xPos,
            y: yPos,
            size: cellTextSize,
            font: fontRegular,
            color: rgb(0, 0, 0),
          });
        });

        currentPage.drawLine({
          start: { x: cellX, y: rowTop },
          end: { x: cellX, y: rowTop - rowHeight },
          thickness: 1,
          color: rgb(0, 0, 0),
        });

        cellX += entry.width;
      });

      currentPage.drawLine({
        start: { x: cellX, y: rowTop },
        end: { x: cellX, y: rowTop - rowHeight },
        thickness: 1,
        color: rgb(0, 0, 0),
      });

      y -= rowHeight;
    });

    y -= 16;
  }
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

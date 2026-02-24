import JSZip from "jszip";
import * as xlsx from "xlsx";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { TabInfo, WindowGroup } from "../types/tab";

const getDisplayDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = String(hours).padStart(2, "0");

  return `${year}/${month}/${day} ${strHours}:${minutes}:${seconds} ${ampm}`;
};

const getFilenameDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

const flattenTabs = (windowGroups: WindowGroup[]): TabInfo[] => {
  return windowGroups.flatMap((group) => group.tabs);
};

export const copyAllUrls = async (
  windowGroups: WindowGroup[],
): Promise<boolean> => {
  try {
    const tabs = flattenTabs(windowGroups);
    const text = tabs.map((tab) => tab.url).join("\n");
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy URLs", error);
    return false;
  }
};

const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
  const avgCharWidth = fontSize * 0.5; // Approximate character width
  const maxChars = Math.floor(maxWidth / avgCharWidth);
  const lines: string[] = [];

  const words = text.split(" ");
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length <= maxChars) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      // Handle long words that exceed max width
      if (word.length > maxChars) {
        let remaining = word;
        while (remaining.length > maxChars) {
          lines.push(remaining.slice(0, maxChars));
          remaining = remaining.slice(maxChars);
        }
        currentLine = remaining;
      } else {
        currentLine = word;
      }
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

export const downloadAllTabs = async (windowGroups: WindowGroup[]) => {
  const tabs = flattenTabs(windowGroups);
  const zip = new JSZip();
  const displayDateTime = getDisplayDateTime();
  const filenameDateTime = getFilenameDateTime();
  const baseFileName = filenameDateTime;

  // CSV Data
  const csvHeader = "Title,URL,Domain\n";
  const csvContent = tabs
    .map(
      (tab) =>
        `"${tab.title.replace(/"/g, '""')}","${tab.url}","${tab.domain}"`,
    )
    .join("\n");
  zip.file(`${baseFileName}.csv`, csvHeader + csvContent);

  // Excel Data
  const worksheet = xlsx.utils.json_to_sheet(
    tabs.map((tab) => ({
      Title: tab.title,
      URL: tab.url,
      Domain: tab.domain,
    })),
  );
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Tabs");
  const excelBuffer = xlsx.write(workbook, { bookType: "xlsx", type: "array" });
  zip.file(`${baseFileName}.xlsx`, excelBuffer);

  // PDF Data using pdf-lib
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 10;
  const fontSizeTitle = 12;
  const fontSizeHeader = 16;
  const lineHeight = fontSize * 1.5;
  const margin = 50;
  const pageWidth = 595.28; // A4 width in points
  const pageHeight = 841.89; // A4 height in points
  const maxWidth = pageWidth - 2 * margin;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;

  // Header
  page.drawText("OneHandle - Saved Tabs", {
    x: margin,
    y: yPosition,
    size: fontSizeHeader,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  yPosition -= lineHeight * 1.5;

  page.drawText(`Generated: ${displayDateTime}`, {
    x: margin,
    y: yPosition,
    size: fontSize,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });
  yPosition -= lineHeight * 2;

  // Tabs
  for (let i = 0; i < tabs.length; i++) {
    const tab = tabs[i];

    // Title
    const titleLines = wrapText(`${i + 1}. ${tab.title}`, maxWidth, fontSizeTitle);
    for (const line of titleLines) {
      if (yPosition < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: fontSizeTitle,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      yPosition -= lineHeight;
    }

    // URL
    const urlLines = wrapText(tab.url, maxWidth - 20, fontSize);
    for (const line of urlLines) {
      if (yPosition < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPosition = pageHeight - margin;
      }
      page.drawText(line, {
        x: margin + 20,
        y: yPosition,
        size: fontSize,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
      yPosition -= lineHeight;
    }

    yPosition -= lineHeight * 0.5; // Extra spacing between items
  }

  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  zip.file(`${baseFileName}.pdf`, pdfBlob);

  // Generate ZIP
  const content = await zip.generateAsync({ type: "blob" });

  // Download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(content);
  link.download = "onehandle.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

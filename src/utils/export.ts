import JSZip from "jszip";
import * as xlsx from "xlsx";
import jsPDF from "jspdf";
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

  // PDF Data
  const doc = new jsPDF();
  let y = 10;
  doc.setFontSize(16);
  doc.text("OneHandle - Saved Tabs", 10, y);
  y += 10;
  doc.setFontSize(10);
  doc.text(`Generated: ${displayDateTime}`, 10, y);
  y += 10;

  tabs.forEach((tab, index) => {
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
    doc.setFont("helvetica", "bold");
    const title = doc.splitTextToSize(`${index + 1}. ${tab.title}`, 190);
    doc.text(title, 10, y);
    y += title.length * 4; // concise line height

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    const url = doc.splitTextToSize(tab.url, 180);
    doc.text(url, 15, y);
    doc.setTextColor(0);
    y += url.length * 4 + 4; // spacing between items
  });

  const pdfBlob = doc.output("blob");
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

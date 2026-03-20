package com.aiinvoice.service;

import com.aiinvoice.config.AppProperties;
import com.aiinvoice.model.Estimate;
import com.aiinvoice.model.Invoice;
import com.aiinvoice.model.Measurement;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PdfGeneratorService {

    private final AppProperties appProperties;

    public String generateInvoicePdf(String invoiceNumber, Estimate estimate, Invoice invoice) {
        try {
            Path outputDir = Path.of(appProperties.invoiceOutputDir());
            Files.createDirectories(outputDir);
            Path filePath = outputDir.resolve(invoiceNumber + ".pdf");

            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(filePath.toFile()));
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

            Paragraph title = new Paragraph(invoice.getCompanyName() + " Invoice", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(16f);
            document.add(title);

            document.add(new Paragraph("Invoice No: " + invoiceNumber, textFont));
            document.add(new Paragraph("Generated On: " + invoice.getGeneratedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), textFont));
            if (Boolean.TRUE.equals(invoice.getGstApplied()) && invoice.getCompanyGstin() != null) {
                document.add(new Paragraph("GSTIN: " + invoice.getCompanyGstin(), textFont));
            }
            document.add(new Paragraph("Client: " + estimate.getProject().getClientName(), textFont));
            document.add(new Paragraph("Project: " + estimate.getProject().getName(), textFont));
            document.add(new Paragraph(" ", textFont));

            document.add(new Paragraph("Item Details", sectionFont));
            document.add(buildItemTable(estimate));
            document.add(new Paragraph(" ", textFont));

            document.add(new Paragraph("Cost Breakdown", sectionFont));
            document.add(buildCostTable(invoice));

            document.close();
            return filePath.toAbsolutePath().toString();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to generate PDF invoice", ex);
        }
    }

    private PdfPTable buildItemTable(Estimate estimate) {
        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        table.setSpacingBefore(8f);
        addCell(table, "Type", true);
        addCell(table, "Material", true);
        addCell(table, "Size", true);
        addCell(table, "Qty", true);
        addCell(table, "Area", true);
        addCell(table, "Rate", true);
        addCell(table, "Cost", true);
        for (Measurement measurement : estimate.getMeasurements()) {
            addCell(table, measurement.getType(), false);
            addCell(table, measurement.getMaterial(), false);
            addCell(table, formatDimensions(measurement), false);
            addCell(table, String.valueOf(measurement.getQuantity()), false);
            addCell(table, measurement.getArea().toPlainString(), false);
            addCell(table, "INR " + measurement.getRatePerSqft().toPlainString(), false);
            addCell(table, "INR " + measurement.getBaseCost().toPlainString(), false);
        }
        return table;
    }

    private PdfPTable buildCostTable(Invoice invoice) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(60);
        table.setSpacingBefore(8f);
        addCell(table, "Subtotal", true);
        addCell(table, "INR " + invoice.getSubtotal().toPlainString(), false);
        addCell(table, "GST", true);
        addCell(table, Boolean.TRUE.equals(invoice.getGstApplied()) ? "INR " + invoice.getGstAmount().toPlainString() : "Not Applicable", false);
        addCell(table, "Invoice Total", true);
        addCell(table, "INR " + invoice.getTotalAmount().toPlainString(), false);
        addCell(table, "Advance Payment", true);
        addCell(table, "INR " + invoice.getAdvancePayment().toPlainString(), false);
        addCell(table, "Balance Due", true);
        addCell(table, "INR " + invoice.getBalanceDue().toPlainString(), false);
        return table;
    }

    private void addCell(PdfPTable table, String value, boolean header) {
        Font font = header
                ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)
                : FontFactory.getFont(FontFactory.HELVETICA, 11);
        PdfPCell cell = new PdfPCell(new Phrase(value, font));
        cell.setPadding(8f);
        table.addCell(cell);
    }

    private String formatDimensions(Measurement measurement) {
        return toFeetInches(measurement.getLengthInches()) + " x " + toFeetInches(measurement.getWidthInches());
    }

    private String toFeetInches(int totalInches) {
        int feet = totalInches / 12;
        int inches = totalInches % 12;
        return feet + "ft " + inches + "in";
    }
}

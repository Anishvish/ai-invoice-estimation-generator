package com.aiinvoice.service;

import com.aiinvoice.config.AppProperties;
import com.aiinvoice.model.Estimate;
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

    public String generateInvoicePdf(String invoiceNumber, Estimate estimate) {
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

            Paragraph title = new Paragraph(appProperties.companyName() + " Invoice", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(16f);
            document.add(title);

            document.add(new Paragraph("Invoice No: " + invoiceNumber, textFont));
            document.add(new Paragraph("Generated On: " + estimate.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), textFont));
            document.add(new Paragraph("Client: " + estimate.getProject().getClientName(), textFont));
            document.add(new Paragraph("Project: " + estimate.getProject().getName(), textFont));
            document.add(new Paragraph(" ", textFont));

            document.add(new Paragraph("Item Details", sectionFont));
            document.add(buildItemTable(estimate));
            document.add(new Paragraph(" ", textFont));

            document.add(new Paragraph("Cost Breakdown", sectionFont));
            document.add(buildCostTable(estimate));

            document.close();
            return filePath.toAbsolutePath().toString();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to generate PDF invoice", ex);
        }
    }

    private PdfPTable buildItemTable(Estimate estimate) {
        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setSpacingBefore(8f);
        addCell(table, "Type", true);
        addCell(table, "Material", true);
        addCell(table, "Length", true);
        addCell(table, "Width", true);
        addCell(table, "Area", true);
        addCell(table, "Cost", true);
        for (Measurement measurement : estimate.getMeasurements()) {
            addCell(table, measurement.getType(), false);
            addCell(table, measurement.getMaterial(), false);
            addCell(table, measurement.getLength().toPlainString(), false);
            addCell(table, measurement.getWidth().toPlainString(), false);
            addCell(table, measurement.getArea().toPlainString(), false);
            addCell(table, "INR " + measurement.getBaseCost().toPlainString(), false);
        }
        return table;
    }

    private PdfPTable buildCostTable(Estimate estimate) {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(60);
        table.setSpacingBefore(8f);
        addCell(table, "Subtotal", true);
        addCell(table, "INR " + estimate.getSubtotal().toPlainString(), false);
        addCell(table, "Additional Charges", true);
        addCell(table, "INR " + estimate.getAdditionalCharges().toPlainString(), false);
        addCell(table, "Discount", true);
        addCell(table, "INR " + estimate.getDiscount().toPlainString(), false);
        addCell(table, "GST (" + estimate.getGstPercentage().toPlainString() + "%)", true);
        addCell(table, "INR " + estimate.getGstAmount().toPlainString(), false);
        addCell(table, "Final Amount", true);
        addCell(table, "INR " + estimate.getFinalAmount().toPlainString(), false);
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
}

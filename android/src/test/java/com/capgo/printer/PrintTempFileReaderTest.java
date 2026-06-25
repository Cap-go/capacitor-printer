package com.capgo.printer;

import static org.junit.Assert.assertArrayEquals;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import org.junit.Test;

public class PrintTempFileReaderTest {

    @Test
    public void readsTempFileFromCacheDirectory() throws IOException {
        File tempFile = File.createTempFile("print_temp", ".pdf");
        tempFile.deleteOnExit();

        byte[] expected = "test-pdf-content".getBytes();
        try (FileOutputStream output = new FileOutputStream(tempFile)) {
            output.write(expected);
        }

        ByteArrayOutputStream actual = new ByteArrayOutputStream();
        try (FileInputStream input = new FileInputStream(tempFile)) {
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = input.read(buffer)) > 0) {
                actual.write(buffer, 0, bytesRead);
            }
        }

        assertArrayEquals(expected, actual.toByteArray());
    }
}

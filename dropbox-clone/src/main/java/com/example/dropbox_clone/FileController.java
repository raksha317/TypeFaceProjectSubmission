package com.example.dropbox_clone;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import java.nio.file.Path;
import org.springframework.http.MediaType;



@RestController
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String filename = fileStorageService.saveFile(file);
            // Save metadata to DB
            FileMetadata metadata = FileMetadata.builder()
            .filename(file.getOriginalFilename())
            .contentType(file.getContentType())
            .size(file.getSize())
            .uploadTime(LocalDateTime.now())
            .uploadedBy("admin")
            .build();

        fileMetadataRepository.save(metadata);
            return ResponseEntity.ok(Map.of("message", "File uploaded successfully", "filename", file.getOriginalFilename()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Upload failed"));
        }
    }
        @GetMapping("/files")
    public ResponseEntity<List<FileMetadata>> getAllFiles() {
        List<FileMetadata> files = fileMetadataRepository.findAll();
        return ResponseEntity.ok(files);
        }
        @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            System.out.println("recieved download" + filename);
            Resource file = fileStorageService.loadFile(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
}
@GetMapping("/files/{filename}")
public ResponseEntity<Resource> viewFile(@PathVariable String filename) {
    try {
        Path filePath = Paths.get("uploads").resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        // Detect content type
        String contentType = Files.probeContentType(filePath);

        // Whitelist of allowed content types
        List<String> allowedTypes = List.of(
            "application/pdf",
            "image/png",
            "image/jpeg",
            "text/plain",
            "application/json"
        );

        if (contentType == null || !allowedTypes.contains(contentType)) {
            return ResponseEntity
                .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                .body(null);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);

    } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}     
}

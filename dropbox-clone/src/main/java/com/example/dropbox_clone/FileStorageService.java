package com.example.dropbox_clone;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;

import java.io.*;
import java.nio.file.*;
import java.util.List;
import java.util.stream.Collectors;

import java.util.stream.Stream;

@Service
public class FileStorageService {

    private final Path uploadPath;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) throws IOException {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadPath); // Create folder if not exists
    }

    public String saveFile(MultipartFile file) throws IOException {
        Path targetLocation = this.uploadPath.resolve(file.getOriginalFilename());
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return file.getOriginalFilename();
    }
    public List<String> listAllFiles() throws IOException {
        try (Stream<Path> stream = Files.list(this.uploadPath)) {
            return stream
                    .filter(Files::isRegularFile)
                    .map(Path::getFileName)
                    .map(Path::toString)
                    .collect(Collectors.toList());
        }
    }
    public Resource loadFile(String filename) throws IOException {
        Path filePath = uploadPath.resolve(filename).normalize();
        System.out.println("recieved filepath" + filePath);
        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("File not found: " + filename);
        }
        return new UrlResource(filePath.toUri());
    }
}

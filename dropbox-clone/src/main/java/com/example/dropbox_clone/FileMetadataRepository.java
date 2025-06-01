package com.example.dropbox_clone;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
}


package com.aiinvoice.exception;

import jakarta.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage(), List.of());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiError> handleBusiness(BusinessException ex) {
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage(), List.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());
        return buildError(HttpStatus.BAD_REQUEST, "Validation failed", details);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraint(ConstraintViolationException ex) {
        return buildError(HttpStatus.BAD_REQUEST, "Validation failed", List.of(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex) {
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error", List.of(ex.getMessage()));
    }

    private ResponseEntity<ApiError> buildError(HttpStatus status, String message, List<String> details) {
        return ResponseEntity.status(status).body(
                new ApiError(LocalDateTime.now(), status.value(), status.getReasonPhrase(), message, details)
        );
    }
}

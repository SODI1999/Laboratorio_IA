package com.bodegacore.exception;

/**
 * Thrown when a requested resource (Asset, Custodian) cannot be found by its identifier.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

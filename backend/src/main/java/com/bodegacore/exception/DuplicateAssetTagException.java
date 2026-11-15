package com.bodegacore.exception;

/**
 * Thrown when an asset creation or update attempts to use an assetTag that already exists.
 */
public class DuplicateAssetTagException extends RuntimeException {

    public DuplicateAssetTagException(String message) {
        super(message);
    }
}

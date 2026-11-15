package com.bodegacore.exception;

/**
 * Thrown when an asset state transition violates domain business rules
 * (e.g. attempting to assign an asset that is EN_MANTENIMIENTO or DE_BAJA).
 */
public class InvalidStateTransitionException extends RuntimeException {

    public InvalidStateTransitionException(String message) {
        super(message);
    }
}

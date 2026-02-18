// InsufficientFreezesException.java
package com.stiq.habittracker.exception;

public class InsufficientFreezesException extends RuntimeException {
    public InsufficientFreezesException(String message) {
        super(message);
    }
}
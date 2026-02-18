// HabitAlreadyCompletedException.java
package com.stiq.habittracker.exception;

public class HabitAlreadyCompletedException extends RuntimeException {
    public HabitAlreadyCompletedException(String message) {
        super(message);
    }
}
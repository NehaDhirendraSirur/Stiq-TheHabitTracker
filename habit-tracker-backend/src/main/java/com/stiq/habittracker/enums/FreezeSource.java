package com.stiq.habittracker.enums;


public enum FreezeSource {
    STREAK,     // earned by hitting a streak milestone
    MILESTONE,  // earned by other milestones
    MANUAL,     // manually granted
    AUTO,       // automatically applied
    ADMIN,      // admin granted
    SYSTEM      // system level
}
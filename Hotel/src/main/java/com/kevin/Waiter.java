package com.kevin;

/**
 * Created by Kevin Kimaru Chege on 3/3/2018.
 */
public class Waiter {
    private String waiterId;
    private String fullName;

    public Waiter(String waiterId, String fullName) {
        this.waiterId = waiterId;
        this.fullName = fullName;
    }

    public String getWaiterId() {
        return waiterId;
    }

    public void setWaiterId(String waiterId) {
        this.waiterId = waiterId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Waiter waiter = (Waiter) o;

        if (waiterId != null ? !waiterId.equals(waiter.waiterId) : waiter.waiterId != null) return false;
        return fullName != null ? fullName.equals(waiter.fullName) : waiter.fullName == null;
    }

    @Override
    public int hashCode() {
        int result = waiterId != null ? waiterId.hashCode() : 0;
        result = 31 * result + (fullName != null ? fullName.hashCode() : 0);
        return result;
    }
}

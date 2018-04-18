package com.kevin.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by Kevin Kimaru Chege on 3/7/2018.
 */
@Entity
public class Salary {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private final  Long id;
    @ManyToOne
    private Employee employee;
    @NotNull
    private int amount;
    @NotNull
    private int month;
    @NotNull
    private int year;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date dateAdded;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date lastModifiedDate;

    protected Salary() {
        id = null;
        dateAdded = new Date();
        lastModifiedDate = new Date();
    }

    public Salary(Employee employee, int amount, int month, int year) {
        this();
        this.employee = employee;
        this.amount = amount;
        this.month = month;
        this.year = year;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Date getDateAdded() {
        return dateAdded;
    }

    public void setDateAdded(Date dateAdded) {
        this.dateAdded = dateAdded;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
}

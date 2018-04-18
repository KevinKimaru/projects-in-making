package com.kevin.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by Kevin Kimaru Chege on 3/7/2018.
 */
@Entity
public class Credit {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private final  Long id;
    @NotNull
    private int amount;
    @NotNull
    @ManyToOne
    private Supplier supplier;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date addedDate;
    @NotNull
    @Temporal(TemporalType.TIME)
    private Date lastModifiedDate;

    public Credit() {
        id = null;
        addedDate = new Date();
        lastModifiedDate = new Date();
    }

    public Credit(int amount, Supplier supplier) {
        this();
        this.amount = amount;
        this.supplier = supplier;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public Date getAddedDate() {
        return addedDate;
    }

    public void setAddedDate(Date addedDate) {
        this.addedDate = addedDate;
    }

    public Date getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Date lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }
}


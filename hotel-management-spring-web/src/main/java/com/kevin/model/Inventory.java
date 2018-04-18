package com.kevin.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by Kevin Kimaru Chege on 3/7/2018.
 */
@Entity
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private final  Long id;
    @OneToOne
    @NotNull
    private Item item;
    @NotNull
    private int quantity;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date dateAdded;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date lastModifiedDate;

    protected Inventory() {
        id = null;
        dateAdded = new Date();
        lastModifiedDate = new Date();
    }

    public Inventory(Item item, int quantity) {
        this();
        this.item = item;
        this.quantity = quantity;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
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
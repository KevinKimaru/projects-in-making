package com.kevin.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

/**
 * Created by Kevin Kimaru Chege on 3/7/2018.
 */
@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private final  Long id;
    @NotNull
    @Size(min = 2, max = 50)
    private String name;
    @NotNull
    private int price;
    @ManyToOne
    private ItemCategory itemCategory;
    @NotNull
    @Size(min = 2, max = 50)
    private String units;
    @OneToOne(mappedBy = "item", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private Inventory inventory;
    @OneToMany(mappedBy = "item", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<StoreIn> storeIns;
    @OneToMany(mappedBy = "item", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<StoreIn> storeOuts;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date dateAdded;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date lastModifiedDate;

    protected Item() {
        id = null;
        dateAdded = new Date();
        lastModifiedDate = new Date();
        storeIns = new ArrayList<>();
        storeOuts = new ArrayList<>();
    }

    public Item(String name, int price, ItemCategory itemCategory) {
        this();
        this.name = name;
        this.price = price;
        this.itemCategory = itemCategory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public ItemCategory getItemCategory() {
        return itemCategory;
    }

    public void setItemCategory(ItemCategory itemCategory) {
        this.itemCategory = itemCategory;
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

    public String getUnits() {
        return units;
    }

    public void setUnits(String units) {
        this.units = units;
    }

    public Inventory getInventory() {
        return inventory;
    }

    public void setInventory(Inventory inventory) {
        this.inventory = inventory;
    }

    public List<StoreIn> getStoreIns() {
        return storeIns;
    }

    public void setStoreIns(List<StoreIn> storeIns) {
        this.storeIns = storeIns;
    }

    public List<StoreIn> getStoreOuts() {
        return storeOuts;
    }

    public void setStoreOuts(List<StoreIn> storeOuts) {
        this.storeOuts = storeOuts;
    }
}

package com.kevin.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Kevin Kimaru Chege on 3/7/2018.
 */
@Entity
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private final  Long id;
    @NotNull
    @Size(min = 0, max = 50)
    private String name;
    @NotNull
    @ManyToOne
    private DishCategory dishCategory;
//    @ManyToMany(mappedBy = "dishes", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
//    private List<CustomerOrder> customerOrders;
    @NotNull
    private int price;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date dateAdded;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date lastModifiedDate;

    protected Dish() {
        id = null;
        dateAdded = new Date();
        lastModifiedDate = new Date();
    }

    public Dish(String name, DishCategory dishCategory, int price) {
        this();
        this.name = name;
        this.dishCategory = dishCategory;
        this.price = price;
//        customerOrders = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DishCategory getDishCategory() {
        return dishCategory;
    }

    public void setDishCategory(DishCategory dishCategory) {
        this.dishCategory = dishCategory;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
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

//    public List<CustomerOrder> getCustomerOrders() {
//        return customerOrders;
//    }
//
//    public void setCustomerOrders(List<CustomerOrder> customerOrders) {
//        this.customerOrders = customerOrders;
//    }
}

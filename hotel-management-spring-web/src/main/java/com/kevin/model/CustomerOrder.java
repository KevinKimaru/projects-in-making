package com.kevin.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Kevin Kimaru Chege on 3/7/2018.
 */
@Entity
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private final  Long id;
    @NotNull
    private int table;
    //map 1: food and price
    //map 2: map 1 and quantity
    @NotNull
    @ManyToMany
    private List<Map<Map<Dish, Integer>, Integer>> dishes;
    @NotNull
    private int total;
    @NotNull
    @ManyToOne
    private Employee waiter;
    //Statuses could be 0 = ordered, 1 = payed
    private int status;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date dateAdded;
    @Temporal(TemporalType.TIME)
    @NotNull
    private Date lastModifiedDate;

    protected CustomerOrder() {
        id = null;
        dishes = new ArrayList<>();
        dateAdded = new Date();
        lastModifiedDate = new Date();
        status = 0;
    }

    public CustomerOrder(int table, List<Map<Map<Dish, Integer>, Integer>> dishes, int total, Employee waiter) {
        this();
        this.table = table;
        this.dishes = dishes;
        this.total = total;
        this.waiter = waiter;
    }

    public int getTable() {
        return table;
    }

    public void setTable(int table) {
        this.table = table;
    }

    public List<Map<Map<Dish, Integer>, Integer>> getDishes() {
        return dishes;
    }

    public void setDishes(List<Map<Map<Dish, Integer>, Integer>> dishes) {
        this.dishes = dishes;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public Employee getWaiter() {
        return waiter;
    }

    public void setWaiter(Employee waiter) {
        this.waiter = waiter;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
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
